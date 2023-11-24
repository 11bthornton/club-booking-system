<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\ClubInstance;
use App\Models\User;
use App\Models\UserClub;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{

    private function simulateDeleteBooking($existingBooking, $user)
    {
        $clubsToDelete = [];

        /**
         * If the existing booking exists
         */
        if ($existingBooking) {

            $clubInstance = ClubInstance::find($existingBooking->club_instance_id);

            if (!$clubInstance) {
                throw new \Exception("Can't find club instance for booking, internal server error");
            }

            if ($clubInstance->club->must_do_all) {
                $allClubsToDelete = ClubInstance::where('club_id', $clubInstance->club_id)->pluck('id');

                // Get all club_instance_id values for the user's bookings
                $thoseThatUserHasBooked = UserClub::where('user_id', $user->id)->pluck('club_instance_id');

                // Find the intersection of the two lists (clubs that appear in both)
                $commonClubs = ClubInstance::whereIn('id', $allClubsToDelete)
                    ->whereIn('id', $thoseThatUserHasBooked)
                    ->get();

                // Instead of deleting, just add to the result
                foreach ($commonClubs as $clubToDelete) {
                    if (UserClub::where('user_id', $user->id)->where('club_instance_id', $clubToDelete->id)->exists()) {
                        $clubsToDelete[] = $clubToDelete;
                    }
                }

            } else {
                $clubsToDelete = [ClubInstance::find($clubInstance->id)];
            }
        }

        return $clubsToDelete;
        // return [];
    }


    private function internalSimulateBooking($id, $user)
    {
        try {

            /**
             * First establish the target club that needs to be booked
             */
            $clubInstance = ClubInstance::find($id);
            $club = $clubInstance->club;

            if (!$clubInstance) {
                throw new \Exception("Club Not Found");
            }

            /**
             * Some clubs require commitment over multiple days/terms so
             * collect all club instances into an array.
             */
            if ($club->must_do_all) {
                $allClubsToBook = ClubInstance::where('club_id', $club->id)->get();
            } else {
                $allClubsToBook = [$clubInstance];
            }

            /**
             * Then, need to establish if any of these clubs don't have capacity. 
             */
            $clubsWithoutCapacity = [];
            foreach ($allClubsToBook as $clubToBook) {
                if (!(is_null($clubToBook->capacity) || $clubInstance->capacity > 0)) {
                    $clubsWithoutCapacity[] = $clubToBook;
                }
            }

            if (count($clubsWithoutCapacity) > 0) {
                throw new \Exception("One or more clubs doesn't have enough capacity");
            }

            /**
             * Students might have clubs booked on days they're trying to book for. 
             */
            $clubsToDelete = [];

            /**
             * For each of the clubs student wants to book, need to find out whether there's
             * already a club booked in that timeslot. 
             */
            foreach ($allClubsToBook as $clubToBook) {

                $existingBooking = UserClub::whereHas('clubInstance', function ($query) use ($clubToBook) {
                    $query->where('half_term', $clubToBook->half_term)
                        ->where('day_of_week', $clubToBook->day_of_week);
                })->where('user_id', $user->id)->first();

                /**
                 * Simulate delete handles the deletion of dependant clubs. 
                 */
                if ($existingBooking) {
                    $clubsToDelete = array_merge($clubsToDelete, $this->simulateDeleteBooking($existingBooking, $user));
                }

                /**
                 * Get the max number of allowed instances per term/year. 
                 * These can be null (unlimited) but must be positive.
                 */
                $maxPerTerm = $clubToBook->club->max_per_term;
                $maxPerYear = $clubToBook->club->max_per_year;


                /**
                 * The `must_do_all` club instances are all booked together, so they're never partially
                 * booked by the user. This is an invariant that's upheld. This is why only one club
                 * has to be added 
                 */
                if ($maxPerTerm) {
                    $existingBookings = UserClub::whereHas('clubInstance', function ($query) use ($club, $clubToBook) {
                        $query
                            ->where('club_id', $club->id)
                            ->where('half_term', $clubToBook->half_term)
                            ->whereNot('day_of_week', $clubToBook->day_of_week); // Suppose this is not really needed. But has no effect.
                    })->where('user_id', $user->id);

                    if ($existingBookings->count() >= $maxPerTerm) {
                        
                        // dd($clubToBook);

                        $clubsToDelete = array_merge($clubsToDelete, $this->simulateDeleteBooking($existingBookings->first(), $user));
                    }
                }

                /**
                 * Same as above but since this is per year don't need the extra checks.
                 */
                if ($maxPerYear) {
                    $existingBookings = UserClub::whereHas('clubInstance', function ($query) use ($club) {
                        $query
                            ->where('club_id', $club->id);
                            // ->where('half_term', $clubToBook->half_term)
                            // ->whereNot('day_of_week', $clubToBook->day_of_week);
                    })->where('user_id', $user->id);

                    if ($existingBookings->count() >= $maxPerYear) {
                        $clubsToDelete = array_merge($clubsToDelete, $this->simulateDeleteBooking($existingBookings->first(), $user));
                    }
                }


            }

            // Extract IDs from $allClubsToBook and $clubsToDelete using collections
            $clubsToBookIds = collect($allClubsToBook)->pluck('id')->all();
            $clubsToDeleteIds = collect($clubsToDelete)->pluck('id')->all();

            // Unique the extracted IDs
            $uniqueClubsToBookIds = array_unique($clubsToBookIds);
            $uniqueClubsToDeleteIds = array_unique($clubsToDeleteIds);

            // Create the result array
            $result = [
                'status' => 'success',
                'data' => [
                    'clubsToBook' => $uniqueClubsToBookIds,
                    'clubsToDelete' => $uniqueClubsToDeleteIds,
                ],
            ];

            return $result;
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

        /**
     * User route
     */
    public function simulateBook($id, Request $request)
    {
        try {
            // Execute the simulation and get the result as an associative array
            $result = $this->internalSimulateBooking($id, $request->user());

            if ($result['status'] === 'error') {
                // Handle the error case with a 500 status code
                return response()->json([
                    'status' => 'error',
                    'message' => $result['message'],
                ], 500);
            }

            // Transform the success result into JSON
            $jsonResult = [
                'status' => 'success',
                'data' => $result['data'],
            ];

            return response()->json($jsonResult);
        } catch (\Exception $e) {
            // Handle any unexpected exceptions with a 500 status code
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function simulateBookAdminMode($id, $userId, Request $request)
    {

        try {

            $user = User::findOrFail($userId);
            // ecute the simulation and get the result as an associative array
            $result = $this->internalSimulateBooking($id, $user);

            if ($result['status'] === 'error') {
                // Handle the error case with a 500 status code
                return response()->json([
                    'status' => 'error',
                    'message' => $result['message'],
                ], 500);
            }

            // Transform the success result into JSON
            $jsonResult = [
                'status' => 'success',
                'data' => $result['data'],
            ];

            return response()->json($jsonResult);
        } catch (\Exception $e) {
            // Handle any unexpected exceptions with a 500 status code
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function bookClubStudent(Request $request, $id) {

        // dd($request->user());
        return $this->bookForUser($request->user(), $id);
    }

    public function bookClubForStudentAsAdmin(Request $request, $clubId, $userId) {

        // dd($request);
        $user = User::findOrFail($userId);
        return $this->bookForUser($user, $clubId, true);
    }

    public function deleteClubForStudentAsAdmin(Request $request, $clubId, $userId) {
        $user = User::findOrFail($userId);

        return $this->deleteBookingForUser($clubId, $user);
    }

    private function bookForUser($user, $id, $adminMode = false)
    {

        DB::beginTransaction();

        try {

            $clubInstance = ClubInstance::find($id);

            if (!$clubInstance) {
                throw new \Exception("Club Not Found - " . $id);
            }

            $clubsInvolved = $this->internalSimulateBooking($clubInstance->id, $user)['data'];

            $clubsToBookIds = $clubsInvolved['clubsToBook'];
            $clubsToDeleteIds = $clubsInvolved['clubsToDelete'];

            $clubsToBook = ClubInstance::whereIn('id', $clubsToBookIds)->get();

            // Retrieve ClubInstance objects for clubsToDeleteIds
            $clubsToDelete = ClubInstance::whereIn('id', $clubsToDeleteIds)->get();

            // Assert that the clubs are actually currently allowed to be booked. 
            $allClubsToBookIds = $clubsToBook->pluck('id');

            // Assert that the clubs are actually currently allowed to be booked. 
            $availableClubs = Club::getAllWithInstancesForUser($user)
                ->pluck('clubInstances')->flatten(1)->pluck('id');

            /**
            * Admin can make special exceptions on behalf of the user
            */
            if(!$adminMode) {
                $allClubsToBookIds->each(function ($clubId) use ($availableClubs) {
                    if (!$availableClubs->contains($clubId)) {
                        throw new \Exception("ID {$clubId} not found in required clubs to book");
                    }
                });
            }

            foreach ($clubsToBook as $clubToBook) {
                $clubToBook->lockForUpdate();
            }

            foreach ($clubsToDelete as $clubToDelete) {
                $clubToDelete->lockForUpdate();
            }

            foreach ($clubsToBook as $clubToBook) {
                if (is_null($clubToBook->capacity) || $clubInstance->capacity > 0) {
                    // continue
                } else {
                    throw new \Exception("One or more clubs doesn't have enough capacity");
                }
            }

            foreach ($clubsToDelete as $clubToDelete) {

                $existingBooking = UserClub::where('user_id', $user->id)->where('club_instance_id', $clubToDelete->id)->first();

                if ($existingBooking) {
                    $existingBooking->delete();
                }

            }

            foreach ($clubsToBook as $clubToBook) {


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

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully booked the club.',
                'data' => [
                    'alreadyBookedOn' => $user->organizedByTerm(),
                    'availableClubs' => Club::getAllWithInstancesForUser($user)
                ]
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);

        }
    }


    /**
     * User route method.
     */
    public function deleteBookingStudent(Request $request, $id) {
        return $this->deleteBookingForUser($id, $request->user());
    }


    private function deleteBookingForUser($id, $user)
    {


        // Start a database transaction
        DB::beginTransaction();

        try {

            $clubToDelete = ClubInstance::findOrFail($id);

            $existingBooking = UserClub::whereHas('clubInstance', function ($query) use ($clubToDelete) {
                $query->where('id', $clubToDelete->id);
            })->where('user_id', $user->id)->first();

            if ($existingBooking) {
                $clubsToDelete = $this->simulateDeleteBooking($existingBooking, $user);

                foreach ($clubsToDelete as $clubToDelete) {

                    $existingBooking = UserClub::where('user_id', $user->id)->where('club_instance_id', $clubToDelete->id)->first();
    
                    if ($existingBooking) {
                        $existingBooking->delete();
                    }
    
                }
            } else {
                throw new \Exception("Can't delete non-existent booking");
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