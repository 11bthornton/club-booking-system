<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

use Illuminate\Support\Facades\Validator;
use App\Rules\YearEndIsOneMoreThanYearStart;

class AcademicYearController extends Controller
{
    //

    public function index() {
        return Inertia::render('AdminBoard/YearConfigure/YearConfigure');
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'yearStart' => 'required|integer',
            'yearEnd' => ['required', 'integer', new YearEndIsOneMoreThanYearStart],
        ]);
    
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
    
        // If validation passes, you can proceed with your logic here.
        // ...
    
        return redirect()->route('admin.academic-year.index');
    }
}
