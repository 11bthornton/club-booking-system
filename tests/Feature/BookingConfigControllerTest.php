<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;
use Illuminate\Support\Facades\Log;

class BookingConfigControllerTest extends TestCase
{
    use RefreshDatabase;


    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->admin()->create();
        $this->actingAs($this->user);

    }

    public function testYearGroupsBeingEmptyProducesError()
    {
        $response = $this->post(route('admin.booking-config.create'), [
            'name' => 'Ne',
            'start_date' => '2023-01-01',
            'end_date' => '2023-01-05',
            'start_time' => '08:00',
            'end_time' => '17:00',
            'year_groups' => [],
            'clubs' => [],
            // Ensure these IDs exist in your test setup
        ]);

        $response->assertSessionHasErrors(['name', 'clubs', 'year_groups']);
    }

    public function testNameAndClubsIncorrentlyDefinedProducesError()
    {

        // Assuming you have a route named 'booking-config.create'
        $response = $this->post(route('admin.booking-config.create'), [
            'name' => 'Ne',
            'start_date' => '2023-01-01',
            'end_date' => '2023-01-05',
            'start_time' => '08:00',
            'end_time' => '17:00',
            'year_groups' => ["7"],
            'clubs' => [],
            // Ensure these IDs exist in your test setup
        ]);

        $response->assertSessionHasErrors(['name', 'clubs']);
    }

    public function testSuccess()
    {

        $club = Club::factory()->withInstances([
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Monday",
                    "yearGroups" => ["7", "8", "9", "10", "11"],
                ]
            ]
        ])->create();

        $ids = $club->clubInstances->pluck('id')->all();

        $formData = [
            'name' => 'New Booking Config',
            'start_date' => '2023-01-01',
            'end_date' => '2023-01-05',
            'start_time' => '08:00',
            'end_time' => '17:00',
            'year_groups' => ["7"],
            'clubs' => $ids,
        ];

        Log::info('Sending form data in test:', $formData);

        $response = $this->post(route('admin.booking-config.create'), $formData);

        $response->assertRedirect(route('admin.booking-config.index'));
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas(
            'booking_configs',
            [
                'name' => 'New Booking Config'
            ]
        );
    }

    public function testWhenNotAllClubsOfMustDoAll()
    {

        $club = Club::factory()->mustDoAll()->withInstances([
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Monday",
                    "yearGroups" => ["7", "8", "9", "10", "11"],
                ],
                [
                    'half_term' => 2,
                    'day_of_week' => "Monday",
                    "yearGroups" => ["7", "8", "9", "10", "11"],
                ]
            ]
        ])->create();

        $ids = $club->clubInstances->pluck('id')->all();

        $formData = [
            'name' => 'New Booking Config',
            'start_date' => '2023-01-01',
            'end_date' => '2023-01-05',
            'start_time' => '08:00',
            'end_time' => '17:00',
            'year_groups' => ["7"],
            'clubs' => [$ids[0]],
        ];

        Log::info('Sending form data in test:', $formData);

        $response = $this->post(route('admin.booking-config.create'), $formData);

        $response->assertRedirect(route('admin.booking-config.index'));
        $response->assertSessionHasNoErrors();
        
        $this->assertDatabaseHas(
            'booking_configs',
            [
                'name' => 'New Booking Config'
            ]
        );
    }

    public function testWhenInputtedClubsDoNotExist()
    {

        $formData = [
            'name' => 'New',
            'start_date' => '2023-01-01',
            'end_date' => '2023-01-05',
            'start_time' => '08:00',
            'end_time' => '17:00',
            'year_groups' => ["7"],
            'clubs' => [101, 102, 103],
            // These are falsified clubs, so the
            // controller should error out here. 
        ];

        Log::info('Sending form data in test:', $formData);

        $response = $this->post(route('admin.booking-config.create'), $formData);
        $response->assertSessionHasErrors(['clubs.0', 'clubs.1', 'clubs.2']);

    }

    public function testSameDateSameTime()
    {
        $club = Club::factory()->withInstances([
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Monday",
                    "yearGroups" => ["7", "8", "9", "10", "11"],
                ]
            ]
        ])->create();

        $ids = $club->clubInstances->pluck('id')->all();

        $formData = [
            'name' => 'New Booking Config',
            'start_date' => '2023-01-01',
            'end_date' => '2023-01-01',
            'start_time' => '08:00',
            'end_time' => '08:00',
            'year_groups' => ["7"],
            'clubs' => $ids,
        ];


        $response = $this->post(route('admin.booking-config.create'), $formData);

        $response->assertSessionHasErrors(['end_time']);
    }

    public function testEarlierEndDayThanStart()
    {
        $club = Club::factory()->withInstances([
            [
                [
                    'half_term' => 1,
                    'day_of_week' => "Monday",
                    "yearGroups" => ["7", "8", "9", "10", "11"],
                ]
            ]
        ])->create();

        $ids = $club->clubInstances->pluck('id')->all();

        $formData = [
            'name' => 'New Booking Config',
            'start_date' => '2023-01-05',
            'end_date' => '2023-01-01',
            'start_time' => '08:00',
            'end_time' => '09:00',
            'year_groups' => ["7"],
            'clubs' => $ids,
        ];


        $response = $this->post(route('admin.booking-config.create'), $formData);

        $response->assertSessionHasErrors(['end_time']);
    }

    


    // public function testCreateBookingConfigValidationErrors()
    // {
    //     $response = $this->post(route('booking-config.create'), []);
    //     $response->assertSessionHasErrors(['name', 'start_date', 'end_date', 'start_time', 'end_time', 'year_groups', 'clubs']);
    // }

    // public function testDeleteBookingConfig()
    // {
    //     // Create a BookingConfig instance
    //     $bookingConfig = BookingConfig::factory()->create();

    //     $response = $this->delete(route('booking-config.delete', $bookingConfig->id));
    //     $this->assertDeleted($bookingConfig);
    // }
    public function testIndexViewData()
    {
        $response = $this->get(route('admin.booking-config.index'));

        $response->assertStatus(200);

        $response->assertInertia(function (AssertableInertia $page) {
            $page->has('scheduleData')
                ->has('clubData')
                ->has('availableDays');
        });
    }




}
