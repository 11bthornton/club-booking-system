<?php

namespace App\Http\Controllers;

use App\Models\ClubInstance;
use App\Models\UserClub;
use App\Models\Club;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * It is vital this function is called within the context of a DB transaction.
     */
    public function deleteBookingNew($existingBooking, $user)
    {

        if ($existingBooking) {

            // We don't need to lock these since we're only ever going
            // to increase the cappacity if there is one.

            $clubInstance = ClubInstance::find($existingBooking->club_instance_id);
            if (!$clubInstance) {
                throw new \Exception("Can't find club instance for booking, internal server error");
            }

            $allClubsToDelete = $clubInstance->mustGoWithForward->concat($clubInstance->mustGoWithReverse);
            $allClubsToDelete[] = $clubInstance;

            foreach ($allClubsToDelete as $clubToDelete) {
                $userClubInstance = UserClub::where('user_id', $user->id)
                    ->where('club_instance_id', $clubToDelete->id)
                    ->first();

                if ($userClubInstance) {
                    $userClubInstance->delete();
                }
            }

        }
    }

    public function simulateDeleteBooking($existingBooking, $user)
    {
        $clubsToDelete = [];

        if ($existingBooking) {
            $clubInstance = ClubInstance::find($existingBooking->club_instance_id);
            if (!$clubInstance) {
                throw new \Exception("Can't find club instance for booking, internal server error");
            }

            $allClubsToDelete = $clubInstance->mustGoWithForward->concat($clubInstance->mustGoWithReverse);
            $allClubsToDelete[] = $clubInstance;

            // Instead of deleting, just add to the result
            foreach ($allClubsToDelete as $clubToDelete) {
                if (UserClub::where('user_id', $user->id)->where('club_instance_id', $clubToDelete->id)->exists()) {
                    $clubsToDelete[] = $clubToDelete;
                }
            }
        }

        return $clubsToDelete;
    }

    public function simulateBook($id, Request $request)
    {
        // We won't use DB transactions here since we are not making any database changes

        try {
            $user = $request->user();

            $clubInstance = ClubInstance::find($id);

            if (!$clubInstance) {
                throw new \Exception("Club Not Found");
            }

            $allClubsToBook = $clubInstance->mustGoWithForward->concat($clubInstance->mustGoWithReverse);
            $allClubsToBook[] = $clubInstance;

            // Check capacity of each club
            $clubsWithoutCapacity = [];
            foreach ($allClubsToBook as $clubToBook) {
                if (!(is_null($clubToBook->capacity) || $clubInstance->capacity > 0)) {
                    $clubsWithoutCapacity[] = $clubToBook;
                }
            }
            if (count($clubsWithoutCapacity) > 0) {
                throw new \Exception("One or more clubs doesn't have enough capacity");
            }

            // Only need to get this once
            $userBookedClubInstanceIds = $user->bookedClubs()->pluck('club_instance_id')->all();

            $clubsToDelete = [];

            foreach ($allClubsToBook as $clubToBook) {
                $existingBooking = UserClub::whereHas('clubInstance', function ($query) use ($clubToBook) {
                    $query->where('half_term', $clubToBook->half_term)
                        ->where('day_of_week', $clubToBook->day_of_week);
                })->where('user_id', $user->id)->first();

                if ($existingBooking) {
                    $clubsToDelete = array_merge($clubsToDelete, $this->simulateDeleteBooking($existingBooking, $user));
                }

                // Check for incompatible clubs
                $incompatibleClubs = $clubToBook->incompatibleForward->concat($clubToBook->incompatibleReverse);

                foreach ($incompatibleClubs as $incompatibleClub) {
                    if (in_array($incompatibleClub->id, $userBookedClubInstanceIds)) {
                        $existingBooking = UserClub::whereHas('clubInstance', function ($query) use ($incompatibleClub) {
                            $query->where('id', $incompatibleClub->id);
                        })->where('user_id', $user->id)->first();

                        if ($existingBooking) {
                            $clubsToDelete = array_merge($clubsToDelete, $this->simulateDeleteBooking($existingBooking, $user));
                        }
                    }
                }
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'clubsToBook' => collect($allClubsToBook)->pluck('id')->all(),
                    'clubsToDelete' => collect($clubsToDelete)->pluck('id')->all()
                ]
            ]);



        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function book(Request $request)
    {

        DB::beginTransaction();

        try {
            $user = $request->user();
            

            $clubInstance = ClubInstance::find($request->id);

            if (!$clubInstance) {
                throw new \Exception("Club Not Found");
            }

            // Find all the clubs I need to book
            $allClubsToBook = $clubInstance->mustGoWithForward->concat($clubInstance->mustGoWithReverse);
            $allClubsToBook[] = $clubInstance;

            $allClubsToBookIds = $allClubsToBook->pluck('id');
            // Asser that the clubs are actually currently allowed to be booked. 
            $availableClubs = Club::getAllWithInstancesForUser($user)
                ->pluck('clubInstances')->flatten(1)->pluck('id');


            $allClubsToBookIds->each(function($clubId) use ($availableClubs) {
                if (!$availableClubs->contains($clubId)) {
                   throw new \Exception("ID {$clubId} not found in required clubs to book");
                }
            });

            // Lock each of the rows for update.
            foreach ($allClubsToBook as $clubToBook) {
                $clubToBook->lockForUpdate();
            }

            foreach ($allClubsToBook as $clubToBook) {
                if (is_null($clubToBook->capacity) || $clubInstance->capacity > 0) {
                    // continue
                } else {
                    throw new \Exception("One or more clubs doesn't have enough capacity");
                }
            }

            // Only need to get this once. 
            $userBookedClubInstanceIds = $user->bookedClubs()->pluck('club_instance_id')->all();

            foreach ($allClubsToBook as $clubToBook) {

                // 1) Check if user has already booked a club for this current day. 
                $existingBooking = UserClub::whereHas('clubInstance', function ($query) use ($clubToBook) {
                    $query->where('half_term', $clubToBook->half_term)
                        ->where('day_of_week', $clubToBook->day_of_week);
                })->where('user_id', $user->id)->first();

                // If so, delete it (this needs to be refactored out, to get all the knock on effects too)
                if ($existingBooking) {
                    $this->deleteBookingNew($existingBooking, $user);
                }

                // 2) Check whether the user has any incompatible clubs for this booking.
                $incompatibleClubs = $clubToBook->incompatibleForward->concat($clubToBook->incompatibleReverse);

                foreach ($incompatibleClubs as $incompatibleClub) {
                    if (in_array($incompatibleClub->id, $userBookedClubInstanceIds)) {

                        $existingBooking = UserClub::whereHas('clubInstance', function ($query) use ($incompatibleClub) {
                            $query->where('id', $incompatibleClub->id);
                        })->where('user_id', $user->id)->first();

                        if ($existingBooking) {
                            $this->deleteBookingNew($existingBooking, $user);
                        }

                    }
                }
            }

            // Then do the bookings:

            foreach ($allClubsToBook as $clubToBook) {
                UserClub::create([
                    'user_id' => $user->id,
                    'club_instance_id' => $clubToBook->id
                ]);

                // Decrement capacity if applicable
                if (!is_null($clubToBook->capacity)) {
                    $clubToBook->decrement('capacity');
                }
            }

            DB::commit();

            // Then return the newly updated set of booked clubs
            // and all the available clubs for the user. Need to do this
            // because the capacity values will have changed.
            return response()->json([
                'status' => 'success',
                'message' => 'Successfully booked the club.',
                'data' => [
                    'alreadyBookedOn' => $user->organizedByTerm(),
                    'availableClubs' => Club::getAllWithInstancesForUser($user)
                ]
            ], 200);

            // return Redirect::route('club.market');

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);

        }
    }


    public function deleteBooking($id, Request $request)
    {
        $user = $request->user();

        // Start a database transaction
        DB::beginTransaction();

        try {

            $clubToDelete = ClubInstance::findOrFail($id);
            $existingBooking = UserClub::whereHas('clubInstance', function ($query) use ($clubToDelete) {
                $query->where('id', $clubToDelete->id);
            })->where('user_id', $user->id)->first();

            if ($existingBooking) {
                $this->deleteBookingNew($existingBooking, $user);
            }

            $organizedByTerm = $user->organizedByTerm();
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully deleted this booking and related bookings.',
                'data' => [
                    // Return the clubInstance object here
                    'alreadyBookedOn' => $organizedByTerm,
                    'availableClubs' => Club::getAllWithInstancesForUser($user)
                ]
            ], 200);

        } catch (\Exception $e) {
            // Rollback the transaction in case of any error
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

}