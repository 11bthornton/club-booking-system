<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookingConfigController;

use App\Models\BookingConfig;
use App\Models\ClubInstance;
use Illuminate\Foundation\Application;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

use App\Models\Club;
use App\Models\User;

use Carbon\Carbon;
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

    // $allClubs->each(function ($club) {
    //     $club->makeHidden(['club_instances']);
    // });

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

    // dd($allClubs->keyBy('id')->toJson());

    return Inertia::render('ClubMarket/ClubMarket', [
        'userAvailableClubs' => $allClubs->keyBy('id'),
        'alreadyBookedOn' => $organizedByTerm,
    ]);

})->middleware(["auth"])->name('club-market');




Route::get('/dashboard', function () {

    // BookingConfig::create([
    //     'scheduled_at' => \Carbon\Carbon::now(),
    //     'ends_at' => \Carbon\Carbon::now()
    // ]);

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
Route::middleware(['auth', 'is.admin'])->group(function() {

    /**
     * Renders the main admin dashboard home view.
     */
    Route::get('/admin', function() {

        $clubs = Club::getAllWithInstances();
        $bookingConfigs = BookingConfig::all();

        $bookingConfigs->map(function ($config) {
            $now = Carbon::now();
            $scheduledAt = Carbon::parse($config->scheduled_at);
            $endsAt = Carbon::parse($config->ends_at);
    
            $config->isLive = $now->between($scheduledAt, $endsAt);
            return $config;
        });


        return Inertia::render(
            'AdminBoard/AdminMain/AdminBoardNew',
            [
                'clubData' => $clubs,
                'scheduleData' => $bookingConfigs
            ]
        );
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

    /**
     * Renders a view to manage the students. 
     */
    Route::get('/admin/students/', function() {

        $students = User::all()->each->append('organized_by_term');

        return Inertia::render('AdminBoard/Students/Students', [
            'students' => $students
        ]);
    });

    Route::get('/admin/students/{id}', function($id) {

        $student = User::findOrFail($id);
        $availableClubs = Club::getAllWithInstancesForUser($student);
        $organizedByTerm = $student->organizedByTerm();

        return Inertia::render('AdminBoard/Students/Student', [
            'student' => $student,
            'availableClubs' => $availableClubs,
            'organizedByTerm' => $organizedByTerm
        ]);
    })->name('admin.students.show');


    Route::post("/admin/club/{id}", [AdminController::class, 'bookForUser'])->name('admin.clubs.book');
   
    /**
     * Route handles insertion of new club.
     */
    Route::post("/admin/clubs", [ClubController::class, 'store'])->name("admin.clubs.create");

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

    /**
     * Some routes for manually managing a students bookings.
     */
    Route::delete('admin/booking/{id}/',
        [AdminController::class, 'deleteBookingForUser']
    );

    Route::post('admin/booking-configs/create', [BookingConfigController::class, 'create']);


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
