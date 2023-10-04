<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\BookingConfig;
use App\Models\UserClub;

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
}