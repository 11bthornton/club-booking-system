<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AllowedClubInstances>
 */
class AllowedClubInstancesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    public function forClubInstance($clubInstanceId) {
        return $this->state(fn(array $attributes) => [
            'club_instance_id' => $clubInstanceId
        ]);
    }
    
    public function forBookingConfig($bookingConfigId) {
        return $this->state(fn(array $attributes) => [
            'booking_config_id' => $bookingConfigId
        ]);
    } 
}
