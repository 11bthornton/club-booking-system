<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

use App\Models\CurrentAcademicYear;
use App\Models\AcademicYear;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'error' => function () {
                return session('error', null);
            },
            'csrf' => function () {
                return csrf_token();
            },
            'year' => function() {
                $currentYearRecord = CurrentAcademicYear::first();
                if ($currentYearRecord) {
                    return AcademicYear::find($currentYearRecord->academic_year_id);
                }
                return null;
            }
        ]);
    }
}
