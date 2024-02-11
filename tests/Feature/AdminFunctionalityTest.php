<?php

namespace Tests\Feature;

use App\Models\BookingConfig;
use App\Models\Club;
use App\Models\User;
use App\Models\YearGroupDays;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdminFunctionalityTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $yearGroups;
    protected $yearGroupDays;
    protected $bookingConfiguration;

    /**
     * Now to create some clubs. These will be in the booking configuration for the given user.
     */
    protected $cookeryClub;
    protected $termLimitOnlyClub;
    protected $mustDoAllClubFull; // Mimics Production 
    protected $exoticTermLimitsClub;
    protected $clubForTestingCapacities;

    /**
     * Clubs Not Available To the User in a booking
     * configuration. Prefixed with "na"
     */

    protected $naCookeryClub;
    protected $naTermLimitOnlyClub;
    protected $naMustDoAllClubFull; // Mimics Production 
    protected $naExoticTermLimitsClub;
    protected $naClubForTestingCapacities;

    protected $naBookingConfiguration;


    protected $futureClub;
    protected $futureBookingConfigurationForFutureClub;


    protected $testStudent;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->admin()->create();
        $this->actingAs($this->user);

        $this->testStudent = User::factory()->yearGroup("7")->create(); 

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


        $this->termLimitOnlyClub = Club::factory()
            ->withLimits(1, null)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["8", "9", "10", "11"])
            ->create();
        $this->naTermLimitOnlyClub = Club::factory()
            ->withLimits(1, null)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["8", "9", "10", "11"])
            ->create();


        $this->cookeryClub = Club::factory()
            ->withLimits(1, 1)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"])
            ->create();
        $this->naCookeryClub = Club::factory()
            ->withLimits(1, 1)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"])
            ->create();


        $this->mustDoAllClubFull = Club::factory()
            ->mustDoAll()
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"])
            ->create();
        $this->naMustDoAllClubFull = Club::factory()
            ->mustDoAll()
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"])
            ->create();


        $this->exoticTermLimitsClub = Club::factory()
            ->withLimits(1, 3)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"])
            ->create();
        $this->naExoticTermLimitsClub = Club::factory()
            ->withLimits(1, 3)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"])
            ->create();


        $this->clubForTestingCapacities = Club::factory()
            ->withLimits(null, null)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"], 1)
            ->create();
        $this->naClubForTestingCapacities = Club::factory()
            ->withLimits(null, null)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"], 1)
            ->create();


        // $this->bookingConfiguration = BookingConfig
        //     ::factory()
        //     ->withYearsAndClubs(
        //         ["7", "8", "9", "10", "11"],
        //         array_merge(
        //             $this->cookeryClub->clubInstances->pluck('id')->toArray(),
        //             $this->termLimitOnlyClub->clubInstances->pluck('id')->toArray(),
        //             $this->mustDoAllClubFull->clubInstances->pluck('id')->toArray(),
        //             $this->exoticTermLimitsClub->clubInstances->pluck('id')->toArray(),
        //             $this->clubForTestingCapacities->clubInstances->pluck('id')->toArray()
        //         )
        //     )->create();

        // // This configuration is live, but not to the user we're testing with.
        // $this->naBookingConfiguration = BookingConfig
        //     ::factory()
        //     ->withYearsAndClubs(
        //         ["8", "9"],
        //         array_merge(
        //             $this->naCookeryClub->clubInstances->pluck('id')->toArray(),
        //             $this->naTermLimitOnlyClub->clubInstances->pluck('id')->toArray(),
        //             $this->naMustDoAllClubFull->clubInstances->pluck('id')->toArray(),
        //             $this->naExoticTermLimitsClub->clubInstances->pluck('id')->toArray(),
        //             $this->naClubForTestingCapacities->clubInstances->pluck('id')->toArray()
        //         )
        //     )->create();

        $this->futureClub = Club::factory()
            ->withLimits(null, null)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"], 1)
            ->create();
        
        // $this->futureBookingConfigurationForFutureClub = BookingConfig
        //     ::factory()
        //     ->withFutureDates()
        //     ->withYearsAndClubs(
        //         ["7", "8", "9", "10", "11"],
        //         $this->futureClub->clubInstances->pluck('id')->toArray()
        //     );

    }

    /**
     * There are no booking configs available,
     * so this tests admin's ability to book clubs for students in the face of that.
     * Don't need to do too much testing because much of this is already tested 
     */
    public function testBookingOfClub(): void
    {  

        $clubInstanceToBook = $this->cookeryClub->clubInstances[0];

        $response = $this->post(route("admin.bookings.book",
            [
                'studentId' => $this->testStudent->id,
                'clubInstanceId' => $clubInstanceToBook->id
            ]
        ));

        $response->assertSuccessful();

        $this->assertDatabaseHas(
            'user_club',
            [
                'user_id' => $this->testStudent->id,
                'club_instance_id' => $clubInstanceToBook->id 
            ]
        );
    }

    public function testBookingOfClubNotAllowedForStudent(): void
    {  

        $clubInstanceToBook = $this->termLimitOnlyClub->clubInstances[0];

        $response = $this->post(route("admin.clubs.book",
            [
                'studentId' => $this->testStudent->id,
                'clubInstanceId' => $clubInstanceToBook->id
            ]
        ));

        $response->assertSuccessful();

        $this->assertDatabaseHas(
            'user_club',
            [
                'user_id' => $this->testStudent->id,
                'club_instance_id' => $clubInstanceToBook->id 
            ]
        );
    }
}
