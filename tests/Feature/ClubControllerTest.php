<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Club;
use App\Models\UserClub;
use App\Models\YearGroupDays;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClubControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $yearGroups;
    protected $yearGroupDays;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->admin()->create();
        $this->actingAs($this->user);

        // Automatically included in database because the migration
        // Puts them there by default.
        $this->yearGroups = ["7", "8", "9", "10", "11"];

        $this->yearGroupDays = [];

        foreach ($this->yearGroups as $yearGroup) {

            $this->yearGroupDays[] = YearGroupDays::factory()
                ->year($yearGroup)
                ->days("Wednesday", "Friday")
                ->create();
        }
    }

    /**
     * A basic feature test example.
     */
    public function testSuccessfulFreeForAllClubWithSingleInstance(): void
    {
        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => false,
            'max_per_term' => null,
            'max_per_year' => null,
            'instances' => [
                [
                    'year_groups' => ["7", "8"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ]
            ]
        ]);

        $this->assertDatabaseHas(
            'clubs',
            [
                'name' => 'Test Club'
            ]
        );

        $newlyCreatedClub = Club::first();

        $this->assertDatabaseHas(
            'club_instances',
            [
                'club_id' => $newlyCreatedClub->id
            ]
        );

        $this->assertEquals(
            $newlyCreatedClub->clubInstances->count(),
            1
        );
    }

    public function testInvalidYearGroupIsIncluded(): void
    {
        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => false,
            'max_per_term' => null,
            'max_per_year' => null,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "6"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ]
            ]
        ]);

        $response->assertSessionHasErrors(['instances.0.year_groups.2']);
    }

    /**
     * In this test instance 
     */
    public function testClubOpenToYearGroupOnInvalidDay()
    {
        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => false,
            'max_per_term' => null,
            'max_per_year' => null,
            'instances' => [
                [
                    'year_groups' => ["7"],
                    'half_term' => 1,
                    'day_of_week' => "Thursday",
                    'capacity' => 50
                ]
            ]
        ]);

        $response->assertSessionHasErrors(['instances']);
        // Needs an assertion here. 
    }



    public function testWhenMustDoAllIsSelectedLimitsAreNulled()
    {

        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => true,
            'max_per_term' => 2,
            'max_per_year' => 3,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 50
                ]
            ]
        ]);

        $this->assertDatabaseHas(
            'clubs',
            [
                'name' => 'Test Club',
                'must_do_all' => true,
                'max_per_term' => null,
                'max_per_year' => null
            ]
        );
    }

    public function testMustDoAllSuccess()
    {
        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => true,
            'max_per_term' => null,
            'max_per_year' => null,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 50
                ]
            ]
        ]);

        $this->assertDatabaseHas(
            'clubs',
            [
                'name' => 'Test Club',

            ]
        );
    }

    public function testMustDoAllCapacitiesDontMatch()
    {
        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => true,
            'max_per_term' => null,
            'max_per_year' => null,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 50
                ]
            ]
        ]);

        $response->assertSessionHasErrors(['instances']);
    }

    public function testMustDoAllCapacitiesDontMatchTwo()
    {
        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => true,
            'max_per_term' => null,
            'max_per_year' => null,
            'instances' => [
                [
                    'year_groups' => ["7", "8",],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 50
                ]
            ]
        ]);

        $response->assertSessionHasErrors(['instances']);
    }

    public function testCorrectTermAndYearLimits()
    {

        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => false,
            'max_per_term' => 3,
            'max_per_year' => 4,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 50
                ]
            ]
        ]);

        $this->assertDatabaseHas(
            'clubs',
            [
                'name' => 'Test Club',
                'max_per_term' => 3,
                'max_per_year' => 4,
            ]
        );
    }

    public function testIncorrectTermAndYearLimits()
    {

        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => false,
            'max_per_term' => 3,
            'max_per_year' => 4,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 4950
                ]
            ]
        ]);

        $this->assertDatabaseHas(
            'clubs',
            [
                'name' => 'Test Club',
                'max_per_term' => 3,
                'max_per_year' => 4,
            ]
        );
    }

    public function testTermLimitIsZero()
    {

        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => false,
            'max_per_term' => 0,
            'max_per_year' => 4,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 4950
                ]
            ]
        ]);

        $response->assertSessionHasErrors(['max_per_term']);
    }

    public function testYearLimitIsZero()
    {

        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => false,
            'max_per_term' => 0,
            'max_per_year' => 0,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 50
                ]
            ]
        ]);

        $response->assertSessionHasErrors(['max_per_year']);
    }

    public function testEqualCorrectTermAndYearLimits()
    {

        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => false,
            'max_per_term' => 3,
            'max_per_year' => 3,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 49
                ]
            ]
        ]);

        $this->assertDatabaseHas(
            'clubs',
            [
                'name' => 'Test Club',
                'max_per_term' => 3,
                'max_per_year' => 3,
            ]
        );
    }


    public function testMustDoAllYearGroupEligibilitiesDontMatch()
    {
        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => true,
            'max_per_term' => null,
            'max_per_year' => null,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Friday",
                    'capacity' => 49
                ]
            ]
        ]);

        $response->assertSessionHasErrors(['instances']);
    }

    public function testDuplicateClubInstanceDayAndTerm()
    {
        $response = $this->post(route('admin.clubs.create'), [
            'name' => "Test Club",
            'description' => "Test Club Description",
            'rule' => "Test Club Rule",
            'is_paid' => true,
            'must_do_all' => true,
            'max_per_term' => null,
            'max_per_year' => null,
            'instances' => [
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ],
                [
                    'year_groups' => ["7", "8", "9"],
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'capacity' => 50
                ]
            ]
        ]);

        $response->assertSessionHasErrors(['instances']);
    }

    public function testUpdateRejectedWhenHasBookingsButVitalsDoChange()
    {
        $club = Club::factory()->withInstances(
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Monday",
                    'year_groups' => ["7"],
                    'capacity' => 12
                ]
            ]
        )->create();

        $user = User::factory()->create();

        $booking = UserClub::factory()->forClubInstance(
            $club->clubInstances()->first()->id
        )->forUser($user->id)
            ->create();

        $response = $this->put(route("admin.clubs.update", ['id' => $club->id]), [
            'name' => "New Name",
            'description' => $club->description,
            'rule' => $club->rule,
            'is_paid' => $club->is_paid,
            'instances' => [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => ["7"],
                    'capacity' => 1
                ]
            ]
        ]);


        $this->assertDatabaseHas('clubs', [
            'name' => "New Name"
        ]);

        $club = Club::find($club->id); 

        $this->assertEquals($club->clubInstances[0]->capacity, 12);

    }

    public function testUpdateIsAcceptedWhenNoBookingsAreCurrentlyActive()
    {
        $club = Club::factory()->withInstances(
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => ["7"],
                    'capacity' => 12
                ]
            ]
        )->create();

        $response = $this->put(route("admin.clubs.update", ['id' => $club->id]), [
            'name' => "New Name",
            'description' => $club->description,
            'rule' => $club->rule,
            'is_paid' => $club->is_paid,
            'must_do_all' => false,
            'instances' => [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => ["7", "8", "9"],
                    'capacity' => 1
                ]
            ]
        ]);


        $this->assertDatabaseHas('clubs', [
            'name' => "New Name"
        ]);

        $club = Club::find($club->id); 
        // dd($club->clubInstances->count());
        $this->assertEquals($club->clubInstances[0]->capacity, 1);
        $this->assertEquals($club->clubInstances[0]->yearGroups->count(), 3);
        $this->assertEquals($club->clubInstances[0]->half_term, 1);
        $this->assertEquals($club->clubInstances[0]->day_of_week, "Wednesday");

    }

    public function testUpdateRemovalAdditionOfInstance()
    {
        $club = Club::factory()->withInstances(
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => ["7"],
                    'capacity' => 12
                ]
            ]
        )->create();

        $response = $this->put(route("admin.clubs.update", ['id' => $club->id]), [
            'name' => "New Name",
            'description' => $club->description,
            'rule' => $club->rule,
            'is_paid' => $club->is_paid,
            'must_do_all' => false,
            'instances' => [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => [],
                    'capacity' => 12
                ],
                [
                    'half_term' => 2,
                    'day_of_week' => "Friday",
                    'year_groups' => ["7", "8", "9"],
                    'capacity' => 12
                ]
            ]
        ]);


        $this->assertDatabaseHas('clubs', [
            'name' => "New Name"
        ]);

        $club = Club::find($club->id); 
        // dd($club->clubInstances->count());
        $this->assertEquals($club->clubInstances->count(), 1);

    }

    public function testSyncRemovalOfYearGroupInstance()
    {
        $club = Club::factory()->withInstances(
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => ["7", "8", "9", "10"],
                    'capacity' => 12
                ]
            ]
        )->create();

        $response = $this->put(route("admin.clubs.update", ['id' => $club->id]), [
            'name' => "New Name",
            'description' => $club->description,
            'rule' => $club->rule,
            'is_paid' => $club->is_paid,
            'must_do_all' => false,
            'instances' => [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => ["7"],
                    'capacity' => 12
                ]
            ]
        ]);


        $this->assertDatabaseHas('clubs', [
            'name' => "New Name"
        ]);

        $club = Club::find($club->id); 
        // dd($club->clubInstances->count());
        $this->assertEquals($club->clubInstances[0]->yearGroups->count(), 1);
        $this->assertTrue($club->clubInstances[0]->yearGroups->pluck("year")->contains("7"));


    }

    public function testSyncRemovalOfYearGroupInstanceTwo()
    {
        $club = Club::factory()->withInstances(
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => ["7", "8", "9", "10"],
                    'capacity' => 12
                ]
            ]
        )->create();

        $response = $this->put(route("admin.clubs.update", ['id' => $club->id]), [
            'name' => "New Name",
            'description' => $club->description,
            'rule' => $club->rule,
            'is_paid' => $club->is_paid,
            'must_do_all' => false,
            'instances' => [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => ["11"],
                    'capacity' => 12
                ]
            ]
        ]);


        $this->assertDatabaseHas('clubs', [
            'name' => "New Name"
        ]);

        $club = Club::find($club->id); 
        // dd($club->clubInstances->count());
        $this->assertEquals($club->clubInstances[0]->yearGroups->count(), 1);
        $this->assertTrue($club->clubInstances[0]->yearGroups->pluck("year")->contains("11"));

    }

    public function testDeletionOfClub() {
        $club = Club::factory()->withInstances(
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => ["7", "8", "9", "10"],
                    'capacity' => 12
                ]
            ]
        )->create();

        $this->assertDatabaseHas('clubs', [
            'id' => $club->id
        ]);

        $this->delete(route("admin.clubs.delete", ['id' => $club->id]), []);

        $this->assertDatabaseMissing('clubs', [
            'id' => $club->id
        ]);

        $this->assertDatabaseMissing('club_instances', [
            'club_id' => $club->id
        ]);
    }

    public function testBookingsAreDeletedOnClubDeletion() {
        $club = Club::factory()->withInstances(
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Wednesday",
                    'year_groups' => ["7", "8", "9", "10"],
                    'capacity' => 12
                ]
            ]
        )->create();

        $user = User::factory()->create();

        $booking = UserClub::factory()->forClubInstance(
            $club->clubInstances()->first()->id
        )->forUser($user->id)
            ->create();

        $this->assertDatabaseHas('clubs', [
            'id' => $club->id
        ]);

        $this->assertDatabaseHas('user_club', [
            'user_id' => $user->id,
            'club_instance_id' => $club->clubInstances->first()->id
        ]);

        $this->delete(route("admin.clubs.delete", ['id' => $club->id]), []);

        $this->assertDatabaseMissing('clubs', [
            'id' => $club->id
        ]);

        $this->assertDatabaseMissing('club_instances', [
            'club_id' => $club->id
        ]);

        $this->assertDatabaseMissing('user_club', [
            'user_id' => $user->id,
            'club_instance_id' => $club->clubInstances->first()->id
        ]);
    }

}
