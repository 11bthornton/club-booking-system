<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\ProfileController;

use Illuminate\Foundation\Application;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

use App\Models\Club;

use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Models\IncompatibleClub;
use App\Models\RequiredClub;

Route::get('/club-market', function () {
    $user = Auth::user();

    $allClubs = Club::getAllWithInstancesForUser($user);

    $clubInstances = $user->bookedClubs()->with('club')->get();

    $organizedByTerm = [];
    $daysOfWeek = ['Wednesday', 'Friday'];
    $maxTerms = 6;
    
    // Initialize the structure first
    for ($term = 1; $term <= $maxTerms; $term++) {
        foreach ($daysOfWeek as $day) {
            $organizedByTerm[$term][$day] = null;
        }
    }
    
    // Then populate with actual data
    foreach ($clubInstances as $instance) {
        $term = $instance->half_term;
        $dayOfWeek = ($instance->day_of_week);
        
        if (isset($organizedByTerm[$term]) && array_key_exists($dayOfWeek, $organizedByTerm[$term])) {
            $organizedByTerm[$term][$dayOfWeek] = $instance;
        }
    }

    $disallowedCombinationsRaw = IncompatibleClub::all();
    $forcedCombinationsRaw = RequiredClub::all();

    $disallowedCombinations = $disallowedCombinationsRaw->map(function($item) {
        return [$item->club_instance_id_1, $item->club_instance_id_2];
    })->all();

    $forcedCombinations = $forcedCombinationsRaw->map(function($item) {
        return [$item->club_instance_id_1, $item->club_instance_id_2];
    })->all();

    return Inertia::render('ClubMarket/ClubMarket', [
        'availableClubs' => $allClubs->keyBy('id'),
        'alreadyBookedOn' => $organizedByTerm,
        'disallowedCombinations' => $disallowedCombinations,
        'forcedCombinations' => $forcedCombinations
    ]);

})->name('club-market');


Route::get('/admin', function() {
    $clubs = Club::getAllWithInstances();
    return Inertia::render('AdminBoard/AdminMain/AdminBoard', [
        'clubs' => $clubs
    ]);
})->name('admin-board');

Route::get('/dashboard', function () {
    $user = Auth::user();

    $bookedClubInstances = $user->bookedClubs()->with('club')->get();

    return Inertia::render('Dashboard', [
        'bookedClubInstances' => $bookedClubInstances,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::delete('/dashboard/bookings/{clubInstanceID}', [BookingController::class, 'removeBooking'])->middleware(['auth', 'verified'])->name('removeBooking');

Route::middleware('auth')->group(function() {
    Route::get('/admin/clubs/{id}', [ClubController::class, 'show']);
    Route::post('/admin/clubs/{id}/update', [ClubController::class, 'updateInstances']);
    Route::put('/admin/clubs/{id}', [ClubController::class, 'update'])->name('admin.clubs.update');
    Route::post('/admin/clubs', [ClubController::class, 'store']); 
    

Route::post('/clubs/book', [BookingController::class, 'book'])
    ->middleware(ThrottleRequests::class.':10,1');

});


require __DIR__.'/auth.php';
