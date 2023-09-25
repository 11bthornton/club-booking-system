<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\ProfileController;

use App\Models\ClubInstance;
use Illuminate\Foundation\Application;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

use App\Models\Club;
use App\Models\User;
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


Route::get('/club-market', function () {
    $user = Auth::user();

    $allClubs = Club::getAllWithInstancesForUser($user);

    $clubInstances = $user->bookedClubs()
        
        ->get();


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

    return Inertia::render('ClubMarket/ClubMarket', [
        'userAvailableClubs' => $allClubs->keyBy('id'),
        'alreadyBookedOn' => $organizedByTerm,

    ]);

})->middleware("auth")->middleware('checkbooking')->name('club-market');


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

Route::get('/booking/{id}/changes', function($id) {
    $user = Auth::user();
    
    $result = ClubInstance::getClubsToChangeIfBooked($user, ClubInstance::findOrFail($id));

    return response()->json($result);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/simulate-book/{id}', [BookingController::class, 'simulateBook']);
});


Route::delete('/dashboard/bookings/{clubInstanceID}', [BookingController::class, 'removeBooking'])->middleware(['auth', 'verified'])->name('removeBooking');


/**
 * Routes for admins of the application.
 */
Route::middleware('is.admin')->group(function() {

    /**
     * Renders the main admin dashboard home view.
     */
    Route::get('/admin', function() {

        return Inertia::render('AdminBoard/AdminMain/AdminBoardNew');
    })->name('admin-board');

    /**
     * A table (data-grid) display of all the clubs, with links
     * to view and edit the clubs in more detail. 
     */
    Route::get('/admin/clubs/', function() {
        $clubs = Club::getAllWithInstances();

        return Inertia::render('AdminBoard/AdminMain/ClubsView', [
            'clubs' => $clubs
        ]);
    });

    

    Route::get('/admin/students/', function() {

        $students = User::all()->each->append('organized_by_term');

        return Inertia::render('AdminBoard/Students/Students', [
            'students' => $students
        ]);
    });

    /**
     * Route handles insertion of new club.
     */
    Route::post("/admin/clubs", [ClubController::class, 'store']);

    /**
     * Route renders new Club Creation Form.
     */
    Route::get('/admin/clubs/new', function() {
        $clubs = Club::getAllWithInstances();

        return Inertia::render('AdminBoard/AdminMain/ClubCreate', [
            'clubs' => $clubs
        ]);
    });

    /**
     * Routes for globally allowing bookings.
     */
    Route::post('/admin/update-booking-status', [AdminController::class, 'updateBookingStatus']);
    Route::get('/admin/get-booking-status', [AdminController::class, 'getBookingStatus']);

    /**
     * Can show and update the instances of a club here.
     */
    Route::get('/admin/clubs/{id}', [ClubController::class, 'show']);
    Route::post('/admin/clubs/{id}/update', [ClubController::class, 'updateInstances']);
    Route::put('/admin/clubs/{id}', [ClubController::class, 'update'])->name('admin.clubs.update');
    

});


Route::middleware('auth')->group(function() {

    Route::post('/club/{id}', [BookingController::class, 'book']);
    Route::delete('/club/{id}', [BookingController::class, 'deleteBooking']);
    
    /**
     * Believe this is redundant. 
     */
    Route::post('/clubs/book', [BookingController::class, 'book'])
        ->middleware(ThrottleRequests::class.':10,1');

});


require __DIR__.'/auth.php';
