<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function incompatibleForward()
    {
        return $this->belongsToMany(
            ClubInstance::class,
            'incompatible_clubs',
            'club_instance_id_1',
            'club_instance_id_2'
        );
    }

    public function incompatibleReverse()
    {
        return $this->belongsToMany(
            ClubInstance::class,
            'incompatible_clubs',
            'club_instance_id_2',
            'club_instance_id_1'
        );
    }

    protected $appends = ['incompatible_club_ids', 'must_go_with_club_ids'];

    public function getIncompatibleClubIdsAttribute()
    {
        $forward = $this->incompatibleForward()->pluck('club_instances.id')->toArray();
        $reverse = $this->incompatibleReverse()->pluck('club_instances.id')->toArray();

        return array_merge($forward, $reverse);
    }

    // Relationships for "must go with" clubs
    public function mustGoWithForward()
    {
        return $this->belongsToMany(
            ClubInstance::class,
            'must_go_with_clubs',
            'club_instance_id_1',
            'club_instance_id_2'
        );
    }

    public function mustGoWithReverse()
    {
        return $this->belongsToMany(
            ClubInstance::class,
            'must_go_with_clubs',
            'club_instance_id_2',
            'club_instance_id_1'
        );
    }


    public function getMustGoWithClubIdsAttribute()
    {
        $forward = $this->mustGoWithForward()->pluck('club_instances.id')->toArray();
        $reverse = $this->mustGoWithReverse()->pluck('club_instances.id')->toArray();

        return array_merge($forward, $reverse);
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