<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\Rule;

class YearEndIsOneMoreThanYearStart implements Rule
{
    public function passes($attribute, $value)
    {
        $yearStart = request()->input('yearStart');
        $yearEnd = $value;

        return $yearEnd == $yearStart + 1;
    }

    public function message()
    {
        return 'The Year End must be one more than Year Start.';
    }
}