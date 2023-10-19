<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YearGroupDays extends Model
{
    use HasFactory;

    protected $appends = ['days_array'];
    protected $hidden = ['created_at', 'id', 'updated_at'];

    public function yearGroup()
    {
        return $this->belongsTo(YearGroup::class);
    }

    /**
     * Define an accessor to get an array of the two days.
     *
     * @return array
     */
    public function getDaysArrayAttribute()
    {
        return [$this->day_1, $this->day_2];
    }
}
