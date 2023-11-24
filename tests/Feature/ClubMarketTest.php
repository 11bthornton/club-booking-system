<?php

namespace Tests\Feature;

use App\Models\BookingConfig;
use App\Models\Club;
use App\Models\User;
use App\Models\YearGroupDays;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

use Tests\TestCase;

class ClubMarketTest extends TestCase
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


    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->yearGroup("7")->create();
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


        $this->termLimitOnlyClub = Club::factory()
            ->withLimits(1, null)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"])
            ->create();
        $this->naTermLimitOnlyClub = Club::factory()
            ->withLimits(1, null)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"])
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


        $this->bookingConfiguration = BookingConfig
            ::factory()
            ->withYearsAndClubs(
                ["7", "8", "9", "10", "11"],
                array_merge(
                    $this->cookeryClub->clubInstances->pluck('id')->toArray(),
                    $this->termLimitOnlyClub->clubInstances->pluck('id')->toArray(),
                    $this->mustDoAllClubFull->clubInstances->pluck('id')->toArray(),
                    $this->exoticTermLimitsClub->clubInstances->pluck('id')->toArray(),
                    $this->clubForTestingCapacities->clubInstances->pluck('id')->toArray()
                )
            )->create();

        // This configuration is live, but not to the user we're testing with.
        $this->naBookingConfiguration = BookingConfig
            ::factory()
            ->withYearsAndClubs(
                ["8", "9"],
                array_merge(
                    $this->naCookeryClub->clubInstances->pluck('id')->toArray(),
                    $this->naTermLimitOnlyClub->clubInstances->pluck('id')->toArray(),
                    $this->naMustDoAllClubFull->clubInstances->pluck('id')->toArray(),
                    $this->naExoticTermLimitsClub->clubInstances->pluck('id')->toArray(),
                    $this->naClubForTestingCapacities->clubInstances->pluck('id')->toArray()
                )
            )->create();

        $this->futureClub = Club::factory()
            ->withLimits(null, null)
            ->withBulkInstances([1, 2, 3, 4, 5, 6], ["Wednesday", "Friday"], ["7", "8", "9", "10", "11"], 1)
            ->create();
        
        $this->futureBookingConfigurationForFutureClub = BookingConfig
            ::factory()
            ->withFutureDates()
            ->withYearsAndClubs(
                ["7", "8", "9", "10", "11"],
                $this->futureClub->clubInstances->pluck('id')->toArray()
            );

    }

    public function testFutureBookingConfigCannotBeBooked()
    {
        $clubToBook = $this->futureClub->clubInstances[0];
        $response = $this->post(route("clubs.book", ['id' => $clubToBook->id]));

        $response->assertServerError();
        $this->assertDatabaseMissing('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $clubToBook->id
        ]);
    }

    public function testBookingOfClubInConfigurationNotApplicableToUser()
    {
        $clubToBook = $this->naCookeryClub->clubInstances[0];
        $response = $this->post(route("clubs.book", ['id' => $clubToBook->id]));

        $response->assertServerError();
        $this->assertDatabaseMissing('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $clubToBook->id
        ]);

    }

    public function testDoubleBookOfCookeryIsRejected(): void
    {

        $this->assertDatabaseHas("allowed_club_instances", [
            'booking_config_id' => $this->bookingConfiguration->id,
            'club_instance_id' => $this->cookeryClub->clubInstances[0]->id,
        ]);

        $this->assertDatabaseHas("allowed_year_groups", [
            "year" => $this->user->year,
            "booking_config_id" => $this->bookingConfiguration->id
        ]);

        $firstInstance = $this->cookeryClub->clubInstances[0];

        $response = $this->post(route("clubs.book", ['id' => $firstInstance->id]));

        $response->assertSuccessful();

        $this->assertDatabaseHas('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $firstInstance->id
        ]);

        $secondInstance = $this->cookeryClub->clubInstances[1];

        $this->post(route("clubs.book", ["id" => $secondInstance->id]));

        $this->assertDatabaseMissing('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $firstInstance->id
        ]);

        $this->assertDatabaseHas('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $secondInstance->id
        ]);
    }

    public function testTermLimitBookingsOnly(): void
    {
        $firstInstance = $this->termLimitOnlyClub->clubInstances[0];

        $response = $this->post(route("clubs.book", ['id' => $firstInstance->id]));
        $response->assertSuccessful();

        $this->assertDatabaseHas('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $firstInstance->id
        ]);

        $secondInstance = $this->termLimitOnlyClub->clubInstances[6];

        // dd($secondInstance);

        $response = $this->post(route("clubs.book", ["id" => $secondInstance->id]));
        $response->assertSuccessful();

        $this->assertDatabaseMissing('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $firstInstance->id
        ]);

        $this->assertDatabaseHas('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $secondInstance->id
        ]);

        $thirdInstance = $this->termLimitOnlyClub->clubInstances[2];

        $response = $this->post(route("clubs.book", ["id" => $thirdInstance->id]));
        $response->assertSuccessful();

        $this->assertDatabaseHas('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $secondInstance->id
        ]);

        $this->assertDatabaseHas('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $thirdInstance->id
        ]);

    }

    public function testBookingClashesWithPreExistingBookingOnSameDay()
    {
        /**
         * Establish the original booking on the same day we want
         * to override
         */

        $firstInstance = $this->cookeryClub->clubInstances[0];
        $secondInstance = $this->termLimitOnlyClub->clubInstances[0];

        $this->assertEquals($firstInstance->day_of_week, $secondInstance->day_of_week);

        $response = $this->post(route("clubs.book", ["id" => $firstInstance->id]));
        $response->assertSuccessful();

        $this->assertDatabaseHas('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $firstInstance->id
        ]);

        $response = $this->post(route("clubs.book", ["id" => $secondInstance->id]));
        $response->assertSuccessful();

        $this->assertDatabaseHas('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $secondInstance->id
        ]);

        $this->assertDatabaseMissing('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $firstInstance->id
        ]);

    }

    public function testBookingOfMustDoAllClub()
    {
        $clubInstances = $this->mustDoAllClubFull->clubInstances;

        $response = $this->post(route("clubs.book", ["id" => $clubInstances[0]->id]));

        $response->assertSuccessful();

        foreach ($clubInstances as $clubInstance) {
            $this->assertDatabaseHas('user_club', [
                'club_instance_id' => $clubInstance->id,
                'user_id' => $this->user->id
            ]);
        }

        // Now try to book another club that will inevitably clash with it: 

        $cookeryInstanceToBook = $this->cookeryClub->clubInstances[0]->id;
        $response = $this->post(route("clubs.book", ['id' => $cookeryInstanceToBook]));

        $response->assertSuccessful();

        foreach ($clubInstances as $clubInstance) {
            $this->assertDatabaseMissing('user_club', [
                'club_instance_id' => $clubInstance->id,
                'user_id' => $this->user->id
            ]);
        }

        $this->assertDatabaseHas('user_club', [
            'club_instance_id' => $cookeryInstanceToBook,
            'user_id' => $this->user->id,
        ]);
    }

    public function testBookingOfMustDoAllClubRemovesExistingSingleInstance()
    {
        $cookeryInstanceToBook = $this->cookeryClub->clubInstances[0]->id;
        $response = $this->post(route("clubs.book", ['id' => $cookeryInstanceToBook]));

        $response->assertSuccessful();

        $this->assertDatabaseHas('user_club', [
            'club_instance_id' => $cookeryInstanceToBook,
            'user_id' => $this->user->id,
        ]);

        $clubInstances = $this->mustDoAllClubFull->clubInstances;

        $response = $this->post(route("clubs.book", ["id" => $clubInstances[0]->id]));

        $response->assertSuccessful();

        foreach ($clubInstances as $clubInstance) {
            $this->assertDatabaseHas('user_club', [
                'club_instance_id' => $clubInstance->id,
                'user_id' => $this->user->id
            ]);
        }

        $this->assertDatabaseMissing('user_club', [
            'club_instance_id' => $cookeryInstanceToBook,
            'user_id' => $this->user->id,
        ]);
    }

    public function testCapacityLimits()
    {

    }

    /**
     * It's a 1 and a 3
     */
    public function testExoticTermLimitsTest()
    {

        $termOneInstancesToBook = $this->exoticTermLimitsClub->clubInstances->where("half_term", 1);
        $termTwoInstancesToBook = $this->exoticTermLimitsClub->clubInstances->where("half_term", 2);
        $termThreeInstancesToBook = $this->exoticTermLimitsClub->clubInstances->where("half_term", 3);
        $termFourInstancesToBook = $this->exoticTermLimitsClub->clubInstances->where("half_term", 4);

        $this->assertTrue(!($termOneInstancesToBook->first()->half_term == $termTwoInstancesToBook->first()->half_Term));
        $this->assertDatabaseEmpty('user_club');

        $response = $this->post(route("clubs.book", ['id' => $termOneInstancesToBook->first()->id]));
        $response->assertSuccessful();

        $response = $this->post(route("clubs.book", ['id' => $termTwoInstancesToBook->first()->id]));
        $response->assertSuccessful();

        $response = $this->post(route("clubs.book", ['id' => $termThreeInstancesToBook->first()->id]));
        $response->assertSuccessful();

        $this->assertDatabaseHas('user_club', [
            'club_instance_id' => $termOneInstancesToBook->first()->id,
            'user_id' => $this->user->id
        ]);

        $this->assertDatabaseHas('user_club', [
            'club_instance_id' => $termTwoInstancesToBook->first()->id,
            'user_id' => $this->user->id
        ]);

        $this->assertDatabaseHas('user_club', [
            'club_instance_id' => $termThreeInstancesToBook->first()->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->post(route("clubs.book", ['id' => $termFourInstancesToBook->first()->id]));
        $response->assertSuccessful();


        $this->assertDatabaseHas('user_club', [
            'club_instance_id' => $termFourInstancesToBook->first()->id,
            'user_id' => $this->user->id
        ]);

        $this->assertDatabaseHas('user_club', [
            'club_instance_id' => $termTwoInstancesToBook->first()->id,
            'user_id' => $this->user->id
        ]);

        $this->assertDatabaseHas('user_club', [
            'club_instance_id' => $termThreeInstancesToBook->first()->id,
            'user_id' => $this->user->id
        ]);

        $this->assertDatabaseMissing('user_club', [
            'club_instance_id' => $termOneInstancesToBook->first()->id,
            'user_id' => $this->user->id
        ]);

        // Now we have a club in term 2, 3, 4 
        // book a club in term 2

        $response = $this->post(route("clubs.book", ['id' => $termTwoInstancesToBook->skip(1)->first()->id]));
        $response->assertSuccessful();

        $this->assertDatabaseHas('user_club', [
            'club_instance_id' => $termTwoInstancesToBook->skip(1)->first()->id,
            'user_id' => $this->user->id
        ]);

        $this->assertDatabaseMissing('user_club', [
            'club_instance_id' => $termTwoInstancesToBook->first()->id,
            'user_id' => $this->user->id
        ]);
    }

    public function testOverCapacity()
    {
        $clubInstancesAvailableForBooking = $this->clubForTestingCapacities->clubInstances;

        foreach ($clubInstancesAvailableForBooking as $instance) {
            $this->assertDatabaseHas('year_group_club', [
                'year' => $this->user->year,
                'club_instance_id' => $instance->id
            ]);
        }

        $this->assertDatabaseHas('clubs', [
            'name' => $this->clubForTestingCapacities->name
        ]);

        $this->assertDatabaseHas('club_instances', [
            'club_id' => $this->clubForTestingCapacities->id
        ]);

        $response = $this->post(route("clubs.book", ['id' => $clubInstancesAvailableForBooking->first()->id]));
        // dd($response);

        $response->assertSuccessful();
        $this->assertDatabaseHas('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $clubInstancesAvailableForBooking->first()->id
        ]);

        $this->assertDatabaseHas('club_instances', [
            'id' => $clubInstancesAvailableForBooking->first()->id,
            'capacity' => 0
        ]);

        // What happens when the club is already booked by the user?
        $response = $this->post(route("clubs.book", ['id' => $clubInstancesAvailableForBooking->first()->id]));
        // dd($response);

        // BUT Could make this clearer for user EVEN THOUGH the interface won't let them do this through the website?
        $response->assertServerError();

        $response = $this->delete(route("bookings.delete", ["id" => $clubInstancesAvailableForBooking->first()->id]));
        // dd($response);
        $response->assertSuccessful();

        $this->assertDatabaseHas('club_instances', [
            'id' => $clubInstancesAvailableForBooking->first()->id,
            'capacity' => 1
        ]);

        $this->assertDatabaseMissing('user_club', [
            'user_id' => $this->user->id,
            'club_instance_id' => $clubInstancesAvailableForBooking->first()->id
        ]);
    }
}
