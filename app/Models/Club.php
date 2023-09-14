<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 
        'description', 
        'rule',
        // any other attributes you want to make mass-assignable
    ];

    public function clubInstances()
    {
        return $this->hasMany(ClubInstance::class, 'club_id');
    }

    /**
     * Gets all the clubs in the list and instances.
     * 
     * Recall an instance is a unique combination of half-term / day / club id
    */
    public static function getAllWithInstances()
    {
        return self::with('clubInstances')->get();
    }

    public static function getAllWithInstancesForUser(User $user)
    {
        $year = $user->year; // Assuming User model has a 'year' attribute
    
        return self::with(['clubInstances' => function ($query) use ($year) {
            $query->whereHas('yearGroups', function ($q) use ($year) {
                $q->where('year_group_club.year', $year); // Reference the column on the pivot table
            });
        }])
        ->whereHas('clubInstances', function ($query) use ($year) {
            $query->whereHas('yearGroups', function ($q) use ($year) {
                $q->where('year_group_club.year', $year); // Ensure the club has at least one instance for the year
            });
        })
        ->get();
    }
    

    public function getUniqueUsersAttribute()
    {
        return User::whereHas('bookedClubs', function($query) {
            $query->where('club_id', $this->id);
        })->withCount('bookedClubs as instances_count')->get();
    }

}
