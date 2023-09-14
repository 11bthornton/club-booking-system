<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Club;
use App\Models\ClubInstance;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ClubController extends Controller
{
    /**
     * Update the specified club in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        // dd($request->all());

        // Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'string',
            'rule' => 'nullable|string',
            // Add other fields if necessary
        ]);

        // Fetch the club
        $club = Club::findOrFail($id);

        // Update the club
        $club->update($request->all());

        // Respond
        return response()->json(['message' => 'Club updated successfully!']);
    }

    public function store(Request $request)
    {
        try {
            // dd($request);

            $data = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                // Assuming description can be optional
                'rule' => 'required'
            ]);

            $club = Club::create($data);

            if ($club) {
                return response()->json(['success' => $club], 201);
            } else {
                return response()->json(['message' => 'Error creating club'], 500);
            }

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error creating club: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $club = Club::with([
            'clubInstances' => function ($query) {
                $query->withCount('users'); // This will give a users_count property on each clubInstance
            },
            'clubInstances.yearGroups',
            'clubInstances.users'
        ])->findOrFail($id);


        $uniqueUsers = $club->uniqueUsers;

        return Inertia::render('AdminBoard/ClubShow/ClubShow', [
            'club' => $club,
            'uniqueUsers' => $uniqueUsers
        ]);
    }



    public function updateInstances(Request $request, $id)
    {
        try {
            $club = Club::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Club not found!',
                'error' => $e->getMessage()
            ], 404);
        }

        $items = $request->input('instances');
        $updatedInstances = [];
        $createdInstances = [];

        try {
            // Begin transaction
            DB::beginTransaction();

            foreach ($items as $item) {
                if (isset($item['id'])) {
                    $clubInstance = ClubInstance::find($item['id']);

                    if ($clubInstance) {
                        if ($item['day_of_week'] === $clubInstance->day_of_week && $item['half_term'] === $clubInstance->half_term) {
                            $clubInstance->update(['capacity' => $item['capacity']]);

                            // Handle yearGroups syncing
                            if (isset($item['year_groups'])) {
                                $yearGroups = collect($item['year_groups'])->pluck('year')->toArray();
                                $clubInstance->yearGroups()->sync($yearGroups);
                            }

                        } else {
                            throw new \Exception("Mismatch in day_of_week or half_term for ClubInstance ID {$item['id']}.");
                        }
                        $updatedInstances[] = $clubInstance->id;
                    } else {
                        // Handle the case where ClubInstance with the given ID doesn't exist
                        throw new \Exception("ClubInstance with ID {$item['id']} not found.");
                    }
                } else {
                    // Create a new ClubInstance and associate with the given year groups
                    $newClubInstance = new ClubInstance;
                    $newClubInstance->club_id = $club->id;
                    $newClubInstance->half_term = $item['half_term'];
                    $newClubInstance->capacity = $item['capacity'];
                    $newClubInstance->day_of_week = $item['day_of_week'];
                    $newClubInstance->save();

                    // Handle yearGroups association
                    if (isset($item['year_groups'])) {
                        $yearGroups = collect($item['year_groups'])->pluck('year')->toArray();
                        $newClubInstance->yearGroups()->attach($yearGroups);
                    }

                    $createdInstances[] = $newClubInstance->id;
                }
            }

            // Commit transaction
            DB::commit();

            return response()->json([
                'message' => 'Processed successfully!',
                'updatedInstances' => $updatedInstances,
                'createdInstances' => $createdInstances
            ]);

        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollback();

            return response()->json([
                'message' => 'Failed to process!',
                'error' => $e->getMessage()
            ], 500);
        }
    }






}