<?php

namespace App\Http\Controllers;

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

    public function store(Request $request)
    {

        return DB::transaction(function () use ($request) {
            try {

                $rules = array_merge($this->mainRules, [
                    'must_do_all' => [
                        'boolean', 
                        'required',
                    ],
                    'max_per_term' => [
                        'integer',
                        'nullable',
                        function ($attribute, $value, $fail) use ($request) {
                            if(!$request->input('must_do_all')) {
                                if ($value < 1) {
                                    $fail("$attribute must be at least one");
                                }
                            }
                        }
                    ],
                    
                    'max_per_year' => [
                        'integer',
                        'nullable',

                        function ($attribute, $value, $fail) use ($request) {
                            if (!is_numeric($value)) {
                                return;
                            }

                            $maxPerTerm = $request->input('max_per_term');

                            if ($maxPerTerm !== null && $value < $maxPerTerm) {
                                $fail("The $attribute must be greater than or equal to max_per_term.");
                            }
                        },
                        function ($attribute, $value, $fail) use ($request) {
                            if(!$request->input('must_do_all')) {
                                if ($value < 1) {
                                    $fail("$attribute must be at least one");
                                }
                            }
                        }
                    ],
                    'instances' => [
                        'required',
                        'array',
                        function ($attribute, $value, $fail) use ($request) {
                            if ($request->input('must_do_all')) {
                                $firstCapacity = null;
                                $isFirstCapacitySet = false;

                                foreach ($value as $instance) {
                                    // Check if year_groups is not empty
                                    if (!empty($instance['year_groups'])) {
                                        if (!$isFirstCapacitySet) {
                                            $firstCapacity = $instance['capacity'] ?? null;
                                            $isFirstCapacitySet = true;
                                        } else if (($instance['capacity'] ?? null) !== $firstCapacity) {
                                            $fail("All capacities must be the same for instances that are actually running (when eligible to one or more year groups) when must_do_all is true.");
                                            break;
                                        }
                                    }
                                }
                            }
                        },
                        function ($attribute, $value, $fail) use ($request) {
                            if ($request->input('must_do_all')) {
                                // First, check if the array is not empty and has more than one element
                                if (!empty($value) && count($value) > 1) {
                                    // Sort and store the first year group array
                                    $firstYearGroups = $value[0]['year_groups'] ?? [];
                                    sort($firstYearGroups);

                                    // Iterate from the second element onwards
                                    foreach (array_slice($value, 1) as $instance) {
                                        // Sort the current year group array
                                        $currentYearGroups = $instance['year_groups'] ?? [];
                                        sort($currentYearGroups);

                                        // Compare the sorted arrays
                                        if ($firstYearGroups !== $currentYearGroups) {
                                            $fail("The list of eligible year groups per instance must be the same when must_do_all is true and they are non empty.");
                                            break;
                                        }
                                    }
                                }
                            }
                        },
                        function ($attribute, $value, $fail) {
                            $combinations = [];
                            foreach ($value as $index => $instance) {
                                $combination = $instance['half_term'] . '-' . $instance['day_of_week'];
                                if (isset($combinations[$combination])) {
                                    $fail("The combination of half_term and day_of_week must be unique in each instance.");
                                    return;
                                }
                                $combinations[$combination] = true;
                            }
                        },

                    ],
                    'instances.*.half_term' => 'required|integer',
                    'instances.*.day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                    'instances.*.year_groups' => 'required|array',
                    'instances.*.year_groups.*' => [
                        'required',
                        // 'distinct',
                        'exists:year_groups,year' // ensures each year group exists in the year_groups table
                    ],
                    'instances.*.capacity' => 'integer|nullable',
                ]);

                $clubData = $request->validate($rules);

                if($clubData['must_do_all']) {
                    $clubData['max_per_year'] = null;
                    $clubData['max_per_term'] = null;
                }

                $clubData['academic_year_id'] = CurrentAcademicYear::first()->academic_year_id;

                $club = Club::create($clubData);

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

    public function update(Request $request, $id)
    {
        $club = Club::findOrFail($id);

        $data = $request->validate($this->mainRules);
        $club->fill($data)->save();

        $associatedUsers = $club->clubInstances->flatMap(function ($clubInstance) {
            return $clubInstance->users;
        });


        if (count($associatedUsers) == 0) {

            $extraRules = [
                'must_do_all' => [
                    'boolean', 
                    'required',
                ],
                'max_per_term' => [
                    'integer',
                    'nullable',
                    function ($attribute, $value, $fail) use ($request) {
                        if(!$request->input('must_do_all')) {
                            if ($value < 1) {
                                $fail("$attribute must be at least one");
                            }
                        }
                    }
                ],
                
                'max_per_year' => [
                    'integer',
                    'nullable',

                    function ($attribute, $value, $fail) use ($request) {
                        if (!is_numeric($value)) {
                            return;
                        }

                        $maxPerTerm = $request->input('max_per_term');

                        if ($maxPerTerm !== null && $value < $maxPerTerm) {
                            $fail("The $attribute must be greater than or equal to max_per_term.");
                        }
                    },
                    function ($attribute, $value, $fail) use ($request) {
                        if(!$request->input('must_do_all')) {
                            if ($value < 1) {
                                $fail("$attribute must be at least one");
                            }
                        }
                    }
                ],
                'instances' => [
                    'required',
                    'array',
                    function ($attribute, $value, $fail) use ($request) {
                        if ($request->input('must_do_all')) {
                            $firstCapacity = null;
                            $isFirstCapacitySet = false;

                            foreach ($value as $instance) {
                                // Check if year_groups is not empty
                                if (!empty($instance['year_groups'])) {
                                    if (!$isFirstCapacitySet) {
                                        $firstCapacity = $instance['capacity'] ?? null;
                                        $isFirstCapacitySet = true;
                                    } else if (($instance['capacity'] ?? null) !== $firstCapacity) {
                                        $fail("All capacities must be the same for instances that are actually running (when eligible to one or more year groups) when must_do_all is true.");
                                        break;
                                    }
                                }
                            }
                        }
                    },
                    function ($attribute, $value, $fail) use ($request) {
                        if ($request->input('must_do_all')) {
                            // First, check if the array is not empty and has more than one element
                            if (!empty($value) && count($value) > 1) {
                                // Sort and store the first year group array
                                $firstYearGroups = $value[0]['year_groups'] ?? [];
                                sort($firstYearGroups);

                                // Iterate from the second element onwards
                                foreach (array_slice($value, 1) as $instance) {
                                    // Sort the current year group array
                                    $currentYearGroups = $instance['year_groups'] ?? [];
                                    sort($currentYearGroups);

                                    // Compare the sorted arrays
                                    if ($firstYearGroups !== $currentYearGroups) {
                                        $fail("The list of eligible year groups per instance must be the same when must_do_all is true and they are non empty.");
                                        break;
                                    }
                                }
                            }
                        }
                    },
                    function ($attribute, $value, $fail) {
                        $combinations = [];
                        foreach ($value as $index => $instance) {
                            $combination = $instance['half_term'] . '-' . $instance['day_of_week'];
                            if (isset($combinations[$combination])) {
                                $fail("The combination of half_term and day_of_week must be unique in each instance.");
                                return;
                            }
                            $combinations[$combination] = true;
                        }
                    },

                ],
                'instances.*.half_term' => 'required|integer',
                'instances.*.day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'instances.*.year_groups' => 'required|array',
                'instances.*.year_groups.*' => [
                    'required',
                    // 'distinct',
                    'exists:year_groups,year' // ensures each year group exists in the year_groups table
                ],
                'instances.*.capacity' => 'integer|nullable',
            ];

            $extraData = $request->validate($extraRules);

            $existingInstances = $club->clubInstances->keyBy(function ($instance) {
                return $instance->half_term . '-' . $instance->day_of_week;
            });

            // Loop through the instances in $extraData and sync them
            foreach ($extraData['instances'] as $instanceData) {
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

            $club->fill($extraData)->save();

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

    protected $mainRules = [
        'name' => 'required|string|min:3',
        'description' => 'required|string|min:3',
        'rule' => 'required|string|min:3',
        'is_paid' => 'required|boolean',
    ];





}