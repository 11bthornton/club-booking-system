<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BookingConfigControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function testCreateBookingConfigSuccess()
    {
        // Assuming you have a route named 'booking-config.create'
        $response = $this->post(route('booking-config.create'), [
            'name' => 'New Booking',
            'start_date' => '2023-01-01',
            'end_date' => '2023-01-05',
            'start_time' => '08:00',
            'end_time' => '17:00',
            'year_groups' => [7, 8],
            'clubs' => [1, 2],
            // Ensure these IDs exist in your test setup
        ]);

        $response->assertRedirect(route('admin.booking-config.index'));
        $this->assertDatabaseHas('booking_configs', ['name' => 'New Booking']);
    }

    public function testCreateBookingConfigValidationErrors()
    {
        $response = $this->post(route('booking-config.create'), []);
        $response->assertSessionHasErrors(['name', 'start_date', 'end_date', 'start_time', 'end_time', 'year_groups', 'clubs']);
    }

    public function testDeleteBookingConfig()
    {
        // Create a BookingConfig instance
        $bookingConfig = BookingConfig::factory()->create();

        $response = $this->delete(route('booking-config.delete', $bookingConfig->id));
        $this->assertDeleted($bookingConfig);
    }
    public function testIndexViewData()
    {
        $response = $this->get(route('booking-config.index'));

        $response->assertStatus(200);
        $response->assertViewHasAll(['scheduleData', 'clubData', 'availableDays']);
    }



}
