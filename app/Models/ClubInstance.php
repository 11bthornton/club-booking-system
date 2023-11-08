<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

use Carbon\Carbon;

class ClubInstance extends Model
{
    use HasFactory;

    protected $fillable = [
        'club_id',
        'half_term',
        'capacity',
        'day_of_week'
    ];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function canBeBooked()
    {
        // Pull the latest relevant BookingConfig
        $bookingConfig = BookingConfig::all()

            ->first();


        // If there's no current BookingConfig, the ClubInstance can't be booked
        if (!$bookingConfig) {
            // die("sdfsd");
            return false;
        }

        return $bookingConfig->canClubInstanceBook($this->id);
    }

    public function yearGroups()
    {
        return $this->belongsToMany(YearGroup::class, 'year_group_club', 'club_instance_id', 'year');
    }

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'user_club',
            'club_instance_id',
            'user_id'
        )->withTimestamps();
    }

    // Relationship for incompatibility
    
   


    public static function getClubsToChangeIfBooked($user, $clubToBook)
    {
        // Try to get relations from the cache or load and then cache them for future use
        $relations = ['mustGoWithForward', 'mustGoWithReverse', 'incompatibleForward', 'incompatibleReverse'];
        foreach ($relations as $relation) {
            if (!Cache::has("club_{$clubToBook->id}_{$relation}")) {
                Cache::forever("club_{$clubToBook->id}_{$relation}", $clubToBook->$relation);
            }
            $clubToBook->setRelation($relation, Cache::get("club_{$clubToBook->id}_{$relation}"));
        }

        $allClubsToBook = tap([$clubToBook], function (&$allClubs) use ($clubToBook) {
            $allClubs = array_merge($allClubs, $clubToBook->mustGoWithForward->all(), $clubToBook->mustGoWithReverse->all());
        });

        $incompatibleClubs = collect($allClubsToBook)
            ->flatMap(fn($club) => array_merge($club->incompatibleForward->all(), $club->incompatibleReverse->all()))
            ->unique('id')
            ->values();

        $additionalClubs = $incompatibleClubs
            ->flatMap(fn($incompatibleClub) => array_merge($incompatibleClub->mustGoWithForward->all(), $incompatibleClub->mustGoWithReverse->all()))
            ->unique('id')
            ->values();

        $finalIncompatibleList = $incompatibleClubs->concat($additionalClubs)
            ->unique('id')
            ->values()
            ->all();

        $userBookedClubIds = $user->bookedClubs->pluck('id')->all();

        $clubsToRemove = array_filter($finalIncompatibleList, fn($club) => in_array($club->id, $userBookedClubIds));

        return [
            'clubsToBook' => array_column($allClubsToBook, 'id'),
            'clubsToRemove' => array_column($clubsToRemove, 'id')
        ];
    }




    // Helper Methods
    public function addIncompatibleClub($id)
    {
        $this->incompatibleClubs()->attach($id);
    }

    public function removeIncompatibleClub($id)
    {
        $this->incompatibleClubs()->detach($id);
    }

    public function addMustGoWithClub($id)
    {
        $this->mustGoWithClubs()->attach($id);
    }

    public function removeMustGoWithClub($id)
    {
        $this->mustGoWithClubs()->detach($id);
    }
}