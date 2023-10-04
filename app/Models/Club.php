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
        $year = $user->year;

        $activeBookingConfigs = $user->getAllActiveBookingConfigs();
        // dd($activeBookingConfigs);
        // Fetch the clubs with their instances without unnecessary relationships
        $clubs = self::with([
            'clubInstances' => function ($query) use ($year) {
                $query->whereHas('yearGroups', function ($q) use ($year) {
                    $q->where('year_group_club.year', $year);
                })
                ->select(['id', 'club_id', 'half_term', 'capacity', 'day_of_week', 'created_at', 'updated_at']); // Only select necessary columns
            },
        ])
        ->whereHas('clubInstances', function ($query) use ($year) {
            $query->whereHas('yearGroups', function ($q) use ($year) {
                $q->where('year_group_club.year', $year);
            });
        })
        ->get();
    
        // Filter club instances based on the criteria
        $clubs->each(function ($club) use ($user, $activeBookingConfigs) {
            $filteredClubInstances = $club->clubInstances->filter(function ($clubInstance) use ($activeBookingConfigs) {
                foreach ($activeBookingConfigs as $bookingConfig) {

                    if ($bookingConfig->canClubInstanceBook($clubInstance->id)) {
                        return true;
                    }
                }
                return false;
            });
            $club->setRelation('clubInstances', $filteredClubInstances);
        });
        
        
        return $clubs;
    }

    




    public function getUniqueUsersAttribute()
    {
        return User::whereHas('bookedClubs', function ($query) {
            $query->where('club_id', $this->id);
        })->withCount('bookedClubs as instances_count')->get();
    }

}