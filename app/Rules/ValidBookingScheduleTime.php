<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\Rule;
use Carbon\Carbon;

class ValidBookingScheduleTime implements Rule
{
    public function passes($attribute, $value)
    {
        $startDate = Carbon::parse(request('start_date') . ' ' . request('start_time'));
        $endDate = Carbon::parse(request('end_date') . ' ' . request('end_time'));

        return $endDate->gte($startDate);
    }

    public function message()
    {
        return 'The end time must be after the start time.';
    }


}
