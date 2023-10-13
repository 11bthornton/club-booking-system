<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;

use Illuminate\Http\Request;
use App\Mail\TestEmail;
use App\Models\Club;
use App\Models\ClubInstance;
use App\Models\YearGroupClub;
use App\Models\IncompatibleClub;
use App\Models\RequiredClub;
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
    return DB::transaction(function () use ($request) {
        try {

            $data = $request->validate([
                'clubTitle' => 'required|string',
                'clubDescription' => 'string|nullable',
                'clubRules' => 'string|nullable',
                'instances' => 'required|array',
                'instances.*.term_no' => 'required|integer',
                'instances.*.day' => 'required|string|in:Wednesday,Friday',
                'instances.*.yearGroups' => 'array',
                // 'instances.*.yearGroups.*' => 'integer|distinct', // assuming yearGroups are integers

                'instances.*.capacity' => 'integer|nullable',
                'compatibilities' => 'required|array',
                'compatibilities.in' => 'array',
                'compatibilities.in.*' => 'array',
                'compatibilities.must' => 'array',
            ]);

            // Create a new club
            $club = Club::create([
                'name' => $data['clubTitle'],
                'description' => $data['clubDescription'],
                'rule' => $data['clubRules'],
            ]);

            // Enumerate through instances
            $tempToActualIdMap = [];
            $counter = 1; // Manual counter for enumeration

            foreach ($data['instances'] as $instance) {
                

                if (isset($instance['yearGroups']) && !empty($instance['yearGroups'])) {

                    $createdInstance = ClubInstance::create([
                        'club_id' => $club->id,
                        'half_term' => $instance['term_no'],
                        // 'capacity' => $instance['capacity'],
                        'capacity' => $instance['capacity'],
                        'day_of_week' => $instance['day']
                    ]);

                $tempToActualIdMap[$counter] = $createdInstance->id;


                    foreach ($instance['yearGroups'] as $year) {
                        YearGroupClub::create([
                            'year' => $year,
                            'club_instance_id' => $createdInstance->id
                        ]);
                    }
                }

                // Store reference of temp ID and actual ID
                $counter++;
            }


            if (isset($data['compatibilities']['in']) && is_array($data['compatibilities']['in'])) {
                
                foreach ($data['compatibilities']['in'] as $pair) {
                
                    if (isset($tempToActualIdMap[$pair[0]]) && isset($tempToActualIdMap[$pair[1]])) {
                        $actualId1 = $tempToActualIdMap[$pair[0]];
                        $actualId2 = $tempToActualIdMap[$pair[1]];
                    
                        IncompatibleClub::create([
                            'club_instance_id_1' => $actualId1,
                            'club_instance_id_2' => $actualId2,
                        ]);
                    }
                }
            }

            if (isset($data['compatibilities']['must']) && is_array($data['compatibilities']['must'])) {
                
                foreach ($data['compatibilities']['must'] as $pair) {
                    if (isset($tempToActualIdMap[$pair[0]]) && isset($tempToActualIdMap[$pair[1]])) {
                        $actualId1 = $tempToActualIdMap[$pair[0]];
                        $actualId2 = $tempToActualIdMap[$pair[1]];
            
                        RequiredClub::create([
                            'club_instance_id_1' => $actualId1,
                            'club_instance_id_2' => $actualId2,
                        ]);
                    }
                }
            }
            
            // Continue with processing the rest of the data

            return Redirect::route("admin.clubs.new");
            
        } catch (\Exception $e) {
            throw $e;
            // Return the error message as a JSON response with a 400 status code
            return response()->json(['error' => $e->getMessage()], 400);
        }
    });
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

            $club->update($request->input('club'));


            $requestInstanceIds = collect($items)->pluck('id')->filter()->all();

            // Find existing instances in DB related to this club and delete those not in the request
            $existingInstances = $club->clubInstances()->pluck('id')->all();

            $instancesToDelete = array_diff($existingInstances, $requestInstanceIds);
            ClubInstance::destroy($instancesToDelete);
            $deletedInstances = array_values($instancesToDelete);
            // Now can modify the club instances relationships;

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
                    $newClubInstance = ClubInstance::create($item);

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

            $club = Club::with([
                'clubInstances' => function ($query) {
                    $query->withCount('users'); // This will give a users_count property on each clubInstance
                },
                'clubInstances.yearGroups',
                'clubInstances.users'
            ])->findOrFail($club->id);
    
            return response()->json([
                'message' => 'Processed successfully!',
                'updatedInstances' => $updatedInstances,
                'createdInstances' => $createdInstances,
                'data' => [
                    'club' => $club,
                    'uniqueUsers' => $club->uniqueUsers
                ]
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