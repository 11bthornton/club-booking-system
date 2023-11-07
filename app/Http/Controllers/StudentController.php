<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Imports\UsersImport;
use App\Models\Club;
use App\Models\User;

use App\Rules\CsvFileValidation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules\Password;

use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    public function update(ProfileUpdateRequest $request, $id)
    {
        $validated = $request->validate([
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        User::findOrFail($id)->update([
            'password' => Hash::make($validated['password']),
        ]);
    }

    /**
     * route("admin.students")
     */
    public function index()
    {
        $students = User::getStudents()->each->append('organized_by_term');

        return Inertia::render('AdminBoard/Students/Students', [
            'students' => $students
        ]);
    }

    /**
     * route("admin.students.show")
     */
    public function show($id)
    {

        $student = User::findOrFail($id);

        $availableClubs = Club::allAvailable();

        $organizedByTerm = $student->organizedByTerm();

        return Inertia::render('AdminBoard/Students/Student', [
            'student' => $student,
            'availableClubs' => $availableClubs,
            'organizedByTerm' => $organizedByTerm
        ]);
    }

    /**
     * route("admin.students.delete")
     */
    public function delete($id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Check if the user to delete is not the currently authenticated user
        if ($user->id === auth()->user()->id) {
            // You can handle this case accordingly, for example, by showing an error message.
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        // Check if the user to delete is not an admin (role = 1)
        if ($user->role === 1) {
            // You can handle this case accordingly, for example, by showing an error message.
            return redirect()->back()->with('error', 'Admin accounts cannot be deleted.');
        }

        // If all checks pass, delete the user
        $user->delete();

        return redirect()->route("admin.students")->with('success', 'User deleted successfully.');
    }

    /**
     * route("admin.students.create")
     */
    public function createIndex()
    {
        return Inertia::render('AdminBoard/Students/StudentCreate/StudentCreate');
    }


    public function import(Request $request)
    {
        // Define validation rules
        $validator = Validator::make($request->all(), [
            'file' => ['required', 'mimes:xlsx',],
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            // Handle validation failure (e.g., return with error messages)
            return redirect()->back()->withErrors($validator);
        }

        // Continue with the import process
        if ($request->hasFile('file')) {
            // Get the uploaded file from the request
            $file = $request->file('file');

            // Get the file path
            $filePath = $file->getRealPath();

            // Import the data using the file path
            Excel::import(new UsersImport, $filePath, null, \Maatwebsite\Excel\Excel::XLSX);

            // Rest of your import logic here
        } else {
            // Handle the case when no file was uploaded
            // You can return an error message or redirect as needed
        }

        // Redirect or return a response as needed
        return Redirect::route("admin.students");
    }

    public function store(Request $request)
    {

        $user = new User;
        $user->fill($request->all());
        $user->role = 0;
        $user->save();
        back();

    }

}
