<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\JSErrorLogController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\DataExportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookingConfigController;

use App\Http\Controllers\SystemController;
use App\Models\BookingConfig;
use App\Models\ClubInstance;
use Illuminate\Foundation\Application;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

use App\Models\Club;
use App\Models\User;
use App\Models\YearGroupDays;


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

/**
 * Laravel generated route.
 */
Route::get('/', function () {
    return Redirect::route("dashboard");
});

/**
 * Laravel generated route. 
 * 
 * TODO: Use for a student how-to.
 */
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', []);
})->middleware(['auth', 'verified'])->name('dashboard');

/**
 * Routes, for the student. These routes require that the system is configured properly first,
 * otherwise the student is simply redirected to a maintenance view. 
 */
Route::middleware(['auth', 'system.is.setup'])->group(function () {
    Route::get('/club-market', function () {
        $user = Auth::user();

        $allClubs = Club::getAllWithInstancesForUser($user);

        return Inertia::render('ClubMarket/ClubMarket', [
            'userAvailableClubs' => $allClubs->keyBy('id'),
            'alreadyBookedOn' => $user->organizedByTerm(),
        ]);

    })->middleware('auth')->name('club.market');


    Route::get('/booking/{id}/changes', function ($id) {
        $user = Auth::user();

        $result = ClubInstance::getClubsToChangeIfBooked($user, ClubInstance::findOrFail($id));

        return response()->json($result);
    });

    Route::middleware(['auth'])->group(function () {
        Route::get('/simulate-book/{id}', [BookingController::class, 'simulateBook']);
    });


    Route::delete('/dashboard/bookings/{clubInstanceID}', [BookingController::class, 'removeBooking'])->middleware(['auth', 'verified'])->name('removeBooking');

    Route::post('/club-market/{id}', [BookingController::class, 'bookClubStudent'])->name("clubs.book");

    Route::delete('/club/{id}', [BookingController::class, 'deleteBookingStudent'])->name("bookings.delete");

    /**
     * Believe this is redundant. 
     */
    Route::post('/clubs/book', [BookingController::class, 'book'])
        ->middleware(ThrottleRequests::class . ':10,1');

});

/**
 * No matter if booking system is correctly configured, students can still change their details.
 */
Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Perhaps not this one
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/**
 * Routes for admins of the application.
 */
Route::middleware(['auth', 'is.admin'])->group(function () {


    /**
     * Renders the main admin dashboard home view.
     */
    Route::get('/admin', function () {

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
            'AdminBoard/AdminMain/Admin',
            [
                'clubData' => $clubs,
                'scheduleData' => $bookingConfigs,
                'availableDays' => YearGroupDays::all()

            ]
        );
    })->name('admin-board');

   

    /**
     * Renders a view to manage the students. 
     */
    Route::get('/admin/students/', [StudentController::class, "index"])->name('admin.students');
    Route::post('/admin/students/import', [StudentController::class, 'import'])->name('admin.students.import');
    Route::patch("/admin/students/{id}", [StudentController::class, "update"])->name("admin.password.update");
    Route::post('/admin/students', [StudentController::class, 'store'])->name('admin.students.store');
    Route::get('/admin/students/{id}', [StudentController::class, 'show'])->name('admin.students.show');
    Route::delete('/admin/students/{id}', [StudentController::class, 'delete'])->name('admin.students.delete');


    Route::get('/admin/configure-year', [AcademicYearController::class, 'index'])->name('admin.academic-year.index');
    Route::post('/admin/configure-year', [AcademicYearController::class, 'store'])->name('admin.academic-year.store');

    Route::get('/admin/admins', [AdminController::class, 'index'])->name("admin.admins");
    Route::delete('/admin/admins/{id}', [AdminController::class, 'delete'])->name('admin.admins.delete');
    Route::post('/admin/admins', [AdminController::class, 'store'])->name("admin.admins.store");


    // Route::post("/admin/club/{id}", [AdminController::class, 'bookForUser'])->name('admin.clubs.book');
    Route::get('/admin/clubs/{id}', [ClubController::class, 'show'])->name('admin.clubs.index');
    Route::put('/admin/clubs/{id}/update', [ClubController::class, 'update'])->name('admin.clubs.update');
    // Route::put('/admin/clubs/{id}', [ClubController::class, 'update']);
    Route::get('/admin/clubs/{id}/download', [DataExportController::class, 'clubDataDownload'])->name('admin.download.club-data-id-spreadsheet');
    Route::delete('/admin/clubs/{id}', [ClubController::class, 'delete'])->name('admin.clubs.delete');
    /**
     * Route handles insertion of new club.
     */
    Route::post("/admin/clubs", [ClubController::class, 'store'])->name("admin.clubs.create");
 /**
     * A table (data-grid) display of all the clubs, with links
     * to view and edit the clubs in more detail. 
     */
    Route::get('/admin/clubs/', [ClubController::class, 'index'])->middleware('system.is.setup')
        ->name("admin.clubs");
    /**
     * Route renders new Club Creation Form.
     */
    Route::get('/admin/new-club', [ClubController::class, 'createIndex'])->name('admin.clubs.new');

    /**
     * Routes for globally allowing bookings.
     */
    Route::post('/admin/update-booking-status', [AdminController::class, 'updateBookingStatus']);
    Route::get('/admin/get-booking-status', [AdminController::class, 'getBookingStatus']);

    /**
     * Can show and update the instances of a club here.
     */
    
    Route::get('/admin/download-spreadsheet', [DataExportController::class, 'downloadTotalUserClubSpreadsheet'])->name('admin.download.total-user-club-spreadsheet');

    /**
     * Some routes for manually managing a students bookings.
     */
    Route::delete(
        'admin/booking/{id}/',
        [AdminController::class, 'deleteBookingForUser']
    );

    Route::post('/admin/booking-configs', [BookingConfigController::class, 'create'])->middleware('system.is.setup')
        ->name('admin.booking-config.create');
    Route::get('/admin/booking-configs', [BookingConfigController::class, 'index'])->middleware('system.is.setup')
        ->name('admin.booking-config.index');
    Route::delete('/admin/booking-configs/{id}', [BookingConfigController::class, 'delete'])->middleware('system.is.setup')
        ->name('admin.booking-config.delete');

    Route::get('/admin/simulate-book/{clubInstanceId}/student/{studentId}', [BookingController::class, 'simulateBookAdminMode'])->name("admin.book.simulate");
    Route::post('/admin/book-for-student/{clubInstanceId}/student/{studentId}', [BookingController::class, 'bookClubForStudentAsAdmin'])->name("admin.bookings.book");
    Route::delete('/admin/delete-for-student/{clubInstanceId}/student/{studentId}', [BookingController::class, 'deleteClubForStudentAsAdmin'])->name("admin.bookings.delete");


    Route::post('/admin/reset', [SystemController::class, 'reset'])->name("admin.reset");

    Route::get('/admin/how-to', function() { die("todo!"); })->name("admin.how-to");
});

Route::post('/report-error', [JSErrorLogController::class, 'store'])->name('report.error');


require __DIR__ . '/auth.php';