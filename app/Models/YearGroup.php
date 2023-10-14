<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YearGroup extends Model
{
    use HasFactory;

    protected $primaryKey = 'year';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $hidden = ["activeBookingConfigs", "futureBookingConfigs"];

    public function activeBookingConfigs()
    {
        return $this->belongsToMany(
            BookingConfig::class,
            'allowed_year_groups',  // pivot table name
            'year',  // foreign key on the pivot table related to YearGroup
            'booking_config_id'  // foreign key on the pivot table related to BookingConfig
        )
        ->where('scheduled_at', '<=', now())
        ->where('ends_at', '>', now());
    }
    

    public function futureBookingConfigs()
{
    return $this->belongsToMany(
        BookingConfig::class,
        'allowed_year_groups',
        'year',
        'booking_config_id'
    )->where('scheduled_at', '>', now())
    ->where('ends_at', '>', now());
}


}
