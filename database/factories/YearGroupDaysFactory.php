<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\YearGroupDays>
 */
class YearGroupDaysFactory extends Factory
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

    public function year($year): static
    {
        return $this->state(fn(array $attributes) => [
            'year' => $year
        ]);
    }

    public function days($day1, $day2): static
    {
       return $this->state(fn(array $attributes) => [
            'day_1' => $day1,
            'day_2' => $day2
       ]); 
    }
}
