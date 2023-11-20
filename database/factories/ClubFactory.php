<?php

namespace Database\Factories;

use App\Models\Club;
use App\Models\ClubInstance;
use App\Models\YearGroupClub;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClubFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Club::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Generate a random number for 'max_per_term'.
        // Define the range for 'max_per_term'.
        $minTerm = 1; // Minimum value for 'max_per_term'
        $maxTerm = 2; // Maximum value for 'max_per_term'

        // Generate 'max_per_term' within the specified range.
        $maxPerTerm = $this->faker->numberBetween($minTerm, $maxTerm);

        // Define the range for 'max_per_year'.
        $minYear = $maxPerTerm; // Ensuring 'max_per_year' is >= 'max_per_term'
        $maxYear = 12; // Maximum value for 'max_per_year'

        // Generate 'max_per_year' within the specified range.
        $maxPerYear = $this->faker->numberBetween($minYear, $maxYear);

        // Generate 'max_per_year' such that it is always >= 'max_per_term'.
        // If you want to allow null, use ternary operator or similar logic.
        $maxPerYear = isset($maxPerTerm) ? $this->faker->numberBetween($maxPerTerm, PHP_INT_MAX) : null;

        return [
            'name' => $this->faker->unique()->company,
            'description' => $this->faker->paragraphs(2, true),
            'rule' => $this->faker->sentences(1, true),
            'must_do_all' => false,
            'max_per_term' => null, // $maxPerTerm,
            'max_per_year' => null, // $maxPerYear,
            'is_paid' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function requiresPayment(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_paid' => true
        ]);
    }

    public function mustDoAll(): static
    {
        return $this->state(fn(array $attributes) => [
            'must_do_all' => true
        ]);
    }

    public function withLimits($term, $year): static
    {
        return $this->state(fn(array $attributes) => [
            'max_per_term' => $term,
            'max_per_year' => $year
        ]);
    }

    public function withInstances(array $clubInstances): static {
        return $this->afterCreating(function(Club $club) use ($clubInstances) {

            foreach($clubInstances as $clubInstanceInput) {
                $clubInstance = ClubInstance::factory();
                
                if(isset($clubInstanceInput['half_term'])) {
                    $clubInstance = $clubInstance->inTerm($clubInstanceInput['half_term']);
                }

                if(isset($clubInstanceInput['day_of_week'])) {
                    $clubInstance = $clubInstance->onDay($clubInstanceInput['day_of_week']);
                }

                if(isset($clubInstanceInput['capacity'])) {
                    $clubInstance = $clubInstance->withCapacity($clubInstanceInput['capacity']);
                }

                $clubInstance = $clubInstance->create([
                    'club_id' => $club->id,
                ]);
            
                foreach($clubInstance['yearGroups'] as $yearGroup) {
                    YearGroupClub::factory()->forYear($yearGroup)->forClubInstance($clubInstance->id);
                }
            }
        });
    }

    

}
