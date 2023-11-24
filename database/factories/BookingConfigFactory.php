<?php

namespace Database\Factories;

use App\Models\AllowedYearGroups;
use App\Models\AllowedClubInstances;
use App\Models\BookingConfig;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BookingConfig>
 */
class BookingConfigFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $startDate = \Carbon\Carbon::parse("2022-5-15 00:00");
        $endDate = \Carbon\Carbon::parse("2050-5-15 00:00");

        return [
            'name' => fake()->company(),
            'scheduled_at' => $startDate,
            'ends_at' => $endDate,
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    public function withYearsAndClubs(array $yearGroups, array $clubInstanceIds) {
        return $this->afterCreating(function(BookingConfig $bookingConfig) use ($yearGroups, $clubInstanceIds) {

            foreach($yearGroups as $yearGroup) {
                AllowedYearGroups::factory()->forYearGroup($yearGroup)->forBookingConfig($bookingConfig->id)->create();
            }

            foreach($clubInstanceIds as $clubInstanceId) {
                AllowedClubInstances::factory()->forClubInstance($clubInstanceId)->forBookingConfig($bookingConfig->id)->create();
            }
        });
    }
}
