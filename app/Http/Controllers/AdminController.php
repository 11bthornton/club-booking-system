<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\User;
use Illuminate\Http\Request;

use App\Models\BookingConfig;
use App\Models\UserClub;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function updateBookingStatus(Request $request)
    {
        $isOpen = $request->input('is_open');
        $scheduledAt = $request->input('scheduled_at'); // null if it's immediate

        $config = new BookingConfig();
        $config->is_open = $isOpen;
        $config->scheduled_at = $scheduledAt;
        $config->save();

        return response()->json(['message' => 'Booking status updated']);
    }

    public function getBookingStatus()
    {
        $currentConfigs = BookingConfig::where('scheduled_at', '<=', now())
            ->orderBy('scheduled_at', 'desc')
            ->first();

        return response()->json($currentConfigs);
    }

    public function deleteBookingForUser(Request $request, $bookingId) {

        $booking = UserClub::findOrFail($bookingId);
        $booking->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully deleted booking for User',
            'data' => [
                /**
                 * 
                 */
            ]
        ]);
    }

    public function index() {
        return Inertia::render("AdminBoard/AdminMain/Admins", [
            'admins' => User::getAdmins()
        ]);
    }

    public function store(Request $request)
    {

        $user = new User;
        $user->fill($request->all());
        // Make sure year doesn't interfere with actual year groups.
        $user->year = "7";
        $user->role = 1;
        $user->save();
        back();

    }

    public function delete($id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Check if the user to delete is not the currently authenticated user
        if ($user->id === auth()->user()->id) {
            // You can handle this case accordingly, for example, by showing an error message.
            return redirect()->back()->with('deleteError', 'You cannot delete your own account.');
        }

        // Check if the user to delete is not an admin (role = 1)
        if ($user->role === 0) {
            // You can handle this case accordingly, for example, by showing an error message.
            return redirect()->back()->with('error', 'This route is for student accounts only.');
        }

        // If all checks pass, delete the user
        $user->delete();

        return redirect()->route("admin.admins")->with('success', 'User deleted successfully.');
    }

    public function reset() {
        // Delete User models with role 0
        User::where('role', 0)->delete();
    
        // Delete all Club models
        Club::truncate();
    }
    
}