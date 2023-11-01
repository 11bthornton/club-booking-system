<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use App\Models\CurrentAcademicYear;

class CheckCurrentAcademicYear
{
    public function handle($request, Closure $next)
    {

        // Check if there is no CurrentAcademicYear record
        if (!CurrentAcademicYear::first()) {
            // Redirect to a specific route if no academic year exists
            if (auth()->check() && auth()->user()->role == 1) {
                // If the user's role is 1, do something different
                // For example, redirect to a different route
                return redirect()->route('admin.academic-year.index');
            } else {


                return Inertia::render("Maintenance");

            }
        }

        // Check the user's role
        

        return $next($request);
    }
}