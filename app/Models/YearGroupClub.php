<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YearGroupClub extends Model
{
    use HasFactory;

    protected $table = 'year_group_club';

    protected $fillable = [
        'year',
        'club_instance_id',
    ];


    protected static function boot()
    {
        parent::boot();

        static::deleted(function ($yearGroupClub) {
            // Here, add the logic to delete the bookings in the user_club table
            // You will likely fetch the club_instance_id from the $yearGroupClub instance
            // and then delete the associated entries in user_club.

            \DB::table('user_club')
                ->where('club_instance_id', $yearGroupClub->club_instance_id)
                ->delete();
        });
    }
}
