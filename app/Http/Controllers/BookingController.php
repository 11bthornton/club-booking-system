<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

class BookingController extends Controller
{
    public function removeBooking($clubInstanceID)
    {
        // Retrieve the authenticated user
        $user = Auth::user();

        // Check if the user is booked on this club instance
        if(!$user->bookedClubs()->where('club_instance_id', $clubInstanceID)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found.'
            ], 404);
        }

        // Detach the clubInstanceID from the user's booked clubs
        $user->bookedClubs()->detach($clubInstanceID);

        $updatedClubs = $user->bookedClubs()->with('club')->get();

        return response($updatedClubs->toJson(), 200)
            ->header('Content-Type', 'application/json');
    }
}
