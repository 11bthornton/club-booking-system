<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClubRequest;
use App\Models\Club;
use App\Models\ClubInstance;
use App\Models\YearGroupClub;
use App\Models\CurrentAcademicYear;
use App\Models\YearGroupDays;

use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Inertia\Inertia;

class ClubController extends Controller
{

    public function store(ClubRequest $clubData)
    {

        return DB::transaction(function () use ($clubData) {
            try {

                if($clubData['must_do_all']) {
                    $clubData['max_per_year'] = null;
                    $clubData['max_per_term'] = null;
                }

                $clubData['academic_year_id'] = CurrentAcademicYear::first()->academic_year_id;

                $club = Club::create($clubData->toArray());

                foreach ($clubData['instances'] as $instance) {

                    if (isset($instance['year_groups']) && !empty($instance['year_groups'])) {

                        $createdInstance = ClubInstance::create([
                            'club_id' => $club->id,
                            'half_term' => $instance['half_term'],

                            'capacity' => $instance['capacity'],
                            'day_of_week' => $instance['day_of_week']
                        ]);

                        foreach ($instance['year_groups'] as $year) {
                            YearGroupClub::create([
                                'year' => $year,
                                'club_instance_id' => $createdInstance->id
                            ]);
                        }
                    }

                }
                $this->show($club->id);

            } catch (\Exception $e) {
                throw $e;

            }
        });
    }
    public function createIndex()
    {

        $clubs = Club::getAllWithInstances();

        return Inertia::render('AdminBoard/Clubs/ClubCreate', [
            'clubs' => $clubs,
            'availableDays' => YearGroupDays::all()
        ]);

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

        $associatedUsers = $club->clubInstances->flatMap(function ($clubInstance) {
            return $clubInstance->users;
        });

        return Inertia::render('AdminBoard/Clubs/ClubCreate', [
            'club' => $club,
            'uniqueUsers' => $associatedUsers,
            'availableDays' => YearGroupDays::all()

        ]);
    }

    public function delete($id)
    {
        $clubToDelete = Club::findOrFail($id);

        $clubToDelete->delete();

        return Redirect::route("admin.clubs");
    }

    public function update(ClubRequest $data, $id)
    {
        $club = Club::findOrFail($id);

        $club->fill($data->toArray())->save();

        $associatedUsers = $club->clubInstances->flatMap(function ($clubInstance) {
            return $clubInstance->users;
        });

        if (count($associatedUsers) == 0) {

            $existingInstances = $club->clubInstances->keyBy(function ($instance) {
                return $instance->half_term . '-' . $instance->day_of_week;
            });

            // Loop through the instances in $extraData and sync them
            foreach ($data['instances'] as $instanceData) {
                $instanceKey = $instanceData['half_term'] . '-' . $instanceData['day_of_week'];

                // Check if the instance already exists
                if ($existingInstances->has($instanceKey)) {
                    $existingInstance = $existingInstances->get($instanceKey);

                    // Sync year groups for the existing instance
                    $existingInstance->yearGroups()->sync($instanceData['year_groups']);

                    // Delete the existing instance if year_groups is empty
                    if (empty($instanceData['year_groups'])) {
                        $existingInstance->delete();
                    } else {
                        // Update the existing instance with the new data
                        $existingInstance->update($instanceData);
                    }
                } elseif (!empty($instanceData['year_groups'])) {
                    // Create a new instance only if year_groups is not empty
                    $newInstance = $club->clubInstances()->create($instanceData);

                    // Sync year groups for the new instance
                    $newInstance->yearGroups()->sync($instanceData['year_groups']);
                }
            }

            $club->fill($data->toArray())->save();

        }

        $this->show($id);
    }

    public function index()
    {
        $clubs = Club::getAllWithInstances();

        return Inertia::render('AdminBoard/Clubs/ClubsView', [
            'clubs' => $clubs
        ]);
    }

}