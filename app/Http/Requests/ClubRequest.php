<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClubRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        return $this->user()->role == 1;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:3',
            'description' => 'required|string|min:3',
            'rule' => 'required|string|min:3',
            'is_paid' => 'required|boolean',
            'must_do_all' => [
                'boolean', 
                'required',
            ],
            'max_per_term' => [
                'integer',
                'nullable',
                function ($attribute, $value, $fail) {
                    if(!$this->input('must_do_all')) {
                        if ($value < 1) {
                            $fail("$attribute must be at least one");
                        }
                    }
                }
            ],
            
            'max_per_year' => [
                'integer',
                'nullable',

                function ($attribute, $value, $fail) {
                    if (!is_numeric($value)) {
                        return;
                    }

                    $maxPerTerm = $this->input('max_per_term');

                    if ($maxPerTerm !== null && $value < $maxPerTerm) {
                        $fail("The $attribute must be greater than or equal to max_per_term.");
                    }
                },
                function ($attribute, $value, $fail) {
                    if(!$this->input('must_do_all')) {
                        if ($value < 1) {
                            $fail("$attribute must be at least one");
                        }
                    }
                }
            ],
            'instances' => [
                'required',
                'array',
                function ($attribute, $value, $fail) {
                    if ($this->input('must_do_all')) {
                        $firstCapacity = null;
                        $isFirstCapacitySet = false;

                        foreach ($value as $instance) {
                            // Check if year_groups is not empty
                            if (!empty($instance['year_groups'])) {
                                if (!$isFirstCapacitySet) {
                                    $firstCapacity = $instance['capacity'] ?? null;
                                    $isFirstCapacitySet = true;
                                } else if (($instance['capacity'] ?? null) !== $firstCapacity) {
                                    $fail("All capacities must be the same for instances that are actually running (when eligible to one or more year groups) when must_do_all is true.");
                                    break;
                                }
                            }
                        }
                    }
                },
                function ($attribute, $value, $fail) {
                    if ($this->input('must_do_all')) {
                        // First, check if the array is not empty and has more than one element
                        if (!empty($value) && count($value) > 1) {
                            // Sort and store the first year group array
                            $firstYearGroups = $value[0]['year_groups'] ?? [];
                            sort($firstYearGroups);

                            // Iterate from the second element onwards
                            foreach (array_slice($value, 1) as $instance) {
                                // Sort the current year group array
                                $currentYearGroups = $instance['year_groups'] ?? [];
                                sort($currentYearGroups);

                                // Compare the sorted arrays
                                if ($firstYearGroups !== $currentYearGroups) {
                                    $fail("The list of eligible year groups per instance must be the same when must_do_all is true and they are non empty.");
                                    break;
                                }
                            }
                        }
                    }
                },
                function ($attribute, $value, $fail) {
                    $combinations = [];
                    foreach ($value as $index => $instance) {
                        $combination = $instance['half_term'] . '-' . $instance['day_of_week'];
                        if (isset($combinations[$combination])) {
                            $fail("The combination of half_term and day_of_week must be unique in each instance.");
                            return;
                        }
                        $combinations[$combination] = true;
                    }
                },

            ],
            'instances.*.half_term' => 'required|integer',
            'instances.*.day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'instances.*.year_groups' => 'array',
            'instances.*.year_groups.*' => [
                // 'required',
                // 'distinct',
                'exists:year_groups,year' // ensures each year group exists in the year_groups table
            ],
            'instances.*.capacity' => 'integer|nullable',
        ];
    }
}
