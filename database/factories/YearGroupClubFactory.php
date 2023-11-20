<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\YearGroupClub>
 */
class YearGroupClubFactory extends Factory
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
            'updated_at' => now(),
        ];
    }

    public function forYear($year): static
    {
        return $this->state(fn(array $attributes) => [
            'year' => $year
        ]);
    }

    
    public function forClubInstance($clubInstanceId): static
    {
        return $this->state(fn(array $attributes) => [
            'club_instance_id' => $clubInstanceId
        ]);
    }
}
