<?php

namespace App\Http\Controllers;

use App\Models\ClubInstance;
use Illuminate\Http\Request;
use Auth;

class BookingController extends Controller
{
    public function removeBooking($clubInstanceID)
{
    // Retrieve the authenticated user
    $user = Auth::user();

    // Check if the user is booked on this club instance
    if (!$user->bookedClubs()->where('club_instance_id', $clubInstanceID)->exists()) {
        return response()->json([
            // 'success' => false,
            'error' => 'Booking not found.'
        ], 404);
    }

    // Detach the clubInstanceID from the user's booked clubs
    $user->bookedClubs()->detach($clubInstanceID);

    $updatedClubs = $user->bookedClubs()->with('club')->get();

    return response()->json([
        'success' => true,
        'data' => $updatedClubs,
        'message' => 'Booking Successfully Removed'
    ], 200);
}


    public function book(Request $request) {

        try {
            $user = Auth::user();

            
            $clubInstances = $request->input('club_instances');

            // Ensure all provided club instances exist
            $validInstanceIds = ClubInstance::whereIn('id', $clubInstances)->pluck('id')->all();
            if (count($validInstanceIds) !== count($clubInstances)) {
                throw new \Exception('Somehow, you have tried to book a non-existent club.');
            }

            // Sync user's club instances
            $user->bookedClubs()->sync($validInstanceIds);


            return response()->json(['success' => 'done!', 'message' => 'Club instances synced successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to sync club instances!',
                'error' => $e->getMessage()
            ], 500);
        }

    }
}
