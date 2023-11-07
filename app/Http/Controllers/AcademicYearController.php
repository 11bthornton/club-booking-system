<?php

namespace App\Http\Controllers;

use App\Imports\UsersImport;
use App\Models\BookingConfig;
use App\Models\UserClub;
use App\Models\YearGroupDays;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use League\Csv\Reader;
use Illuminate\Support\Facades\DB; // Import the DB facade

use Inertia\Inertia;

use App\Rules\CsvFileValidation;
use App\Rules\YearEndIsOneMoreThanYearStart;

use App\Models\Club;
use App\Models\User;
use App\Models\AcademicYear;
use App\Models\CurrentAcademicYear;
use Maatwebsite\Excel\Facades\Excel;


class AcademicYearController extends Controller
{
    //

    public function index() {
        return Inertia::render('AdminBoard/YearConfigure/YearConfigure', [
            'clubs' => Club::all()
        ]);
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'yearStart' => [
                'required',
                'integer',
                'unique:academic_years,year_start', // Use 'year_start' as the column name
            ],
            'yearEnd' => [
                'required',
                'integer',
                'different:yearStart', // Ensure yearEnd is different from yearStart
                'unique:academic_years,year_end', // Use 'year_end' as the column name
                new YearEndIsOneMoreThanYearStart, // Your custom rule
            ],
            
            //new CsvFileValidation
            'usersFile' => ['nullable', 'file', ],
            'transferStudents' => 'required|boolean',
            'keepClubs' => [
                // 'required', // The field must be present
                'array',    // It must be an array
                'distinct', // The values must be unique within the array
            ],
            'keepClubs.*' => [
                'integer', // Each value in the array must be an integer
                'exists:clubs,id', // Check if each integer exists as a Club ID in the clubs table
            ],
        ]);
        
        if ($validator->fails()) {
            $allErrors = $validator->errors()->toArray(); // Retrieve all validation errors as an associative array
        
            // Get all errors for the 'usersFile' field
            $usersFileErrors = $validator->errors()->get('usersFile');
        
            // Append each 'usersFile' error individually to the main errors array
            foreach ($usersFileErrors as $error) {
                $allErrors['usersFile'][] = $error;
            }
        
            return redirect()->back()->withErrors($allErrors)->withInput();
        }
        
        try {
            DB::beginTransaction();
            $newAcademicYear = new AcademicYear([
                'year_start' => $request->yearStart,
                'year_end' => $request->yearEnd,
                'term1_start' => $request->term1_start,
                'term2_start' => $request->term2_start,
                'term3_start' => $request->term3_start,
                'term4_start' => $request->term4_start,
                'term5_start' => $request->term5_start,
                'term6_start' => $request->term6_start,

                'term1_name' => $request->term1_name,
                'term2_name' => $request->term2_name,
                'term3_name' => $request->term3_name,
                'term4_name' => $request->term4_name,
                'term5_name' => $request->term5_name,
                'term6_name' => $request->term6_name,

            ]);
    
            $newAcademicYear->save(); 
            
            $currentAcademicYear = CurrentAcademicYear::first();
            
        
            BookingConfig::all()->each(function ($config) {
                $config->delete();
            });
            UserClub::all()->each(function ($booking) {
                $booking->delete();
            });

            if ($currentAcademicYear) {
                // Delete the record
                $currentAcademicYear->delete();
            }
    
            $newCurrentAcademicYear = new CurrentAcademicYear(
                [
                    'academic_year_id' => $newAcademicYear->id
                ]
            );
    
            $newCurrentAcademicYear->save();

            foreach ($request->days as $days) {
                YearGroupDays::where('year', $days['year'])->update([
                    'day_1' => $days['day_1'],
                    'day_2' => $days['day_2']
                ]);
            }
    
    
            if(isset($request->keepClubs)) {
                foreach ($request->keepClubs as $clubId) {
                    // Find the Club model by ID
                    $club = Club::find($clubId);
                
                    if ($club) {
                        // Update the academic_year_id property
                        $club->academic_year_id = $newCurrentAcademicYear->academic_year_id;
                        $club->save(); // Save the changes to the database
                    }
                }
            }

            $students = User::getStudents();
            // $users = User::all();
            
            if($request->transferStudents) {
                foreach ($students as $student) {
                    $year = $student->year;
                
                    if (in_array($year, [7, 8, 9, 10])) {
                        // Increment the year by one and save
                        $student->year = $year + 1;
                        $student->save();
                    } elseif ($year === 11) {
                        // Delete the user
                        $student->delete();
                    }
                }
            } else {
                foreach ($students as $student) {
                    $student->delete();
                }
            }

            // Then insert the new users.
            if ($request->hasFile('usersFile')) {
                // Get the uploaded file from the request
                $file = $request->file('usersFile');
    
                // Get the file path
                $filePath = $file->getRealPath();
    
                // Import the data using the file path
                // Excel::import(new UsersImport, $filePath, null, $readerType = \Maatwebsite\Excel\Excel::XLSX);
    
            } 
            
            DB::commit();
        } catch(\Exception $e) {
            DB::rollback();

            throw $e;
        }
        return redirect()->route('admin.academic-year.index');
    }
}
