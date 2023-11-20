<?php

namespace Database\Factories;

use App\Models\Club;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClubInstance>
 */
class ClubInstanceFactory extends Factory
{

    public function definition()
    {
        $availableDays = ['Wednesday', 'Friday'];

        $validClubs = Club::all()->filter(function ($club) use ($availableDays) {
            $daysAlreadyChosen = $club->clubInstances->pluck('day_of_week')->toArray();
            $remainingDays = array_diff($availableDays, $daysAlreadyChosen);
            return !empty($remainingDays);
        });

        if ($validClubs->isEmpty()) {
            $club = Club::factory()->create();
            $selectedDay = $this->faker->randomElement($availableDays);
        } else {
            $club = $validClubs->random();
            $daysAlreadyChosen = $club->clubInstances->pluck('day_of_week')->toArray();
            $remainingAvailableDays = array_diff($availableDays, $daysAlreadyChosen);
            $selectedDay = $this->faker->randomElement($remainingAvailableDays);
        }

        return [
            'club_id' => $club->id,
            'half_term' => $this->faker->numberBetween(1, 6),
            'capacity' => $this->faker->numberBetween(10, 100),
            'day_of_week' => $selectedDay,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function onDay($day): static
    {
        return $this->state(fn(array $attributes) => [
            'day_of_week' => $day
        ]);
    }

    public function inTerm($term): static
    {
        return $this->state(fn(array $attributes) => [
            'half_term' => $term
        ]);
    }

    public function withCapacity($capacity): static
    {
        return $this->state(fn(array $attributes) => [
            'capacity' => $capacity
        ]);
    }

}
