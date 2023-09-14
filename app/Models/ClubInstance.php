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

    // Relationships for incompatibility and must go with
    public function incompatibleClubs()
    {
        return $this->belongsToMany(
            ClubInstance::class,
            'incompatible_clubs',
            'club_instance_id_1',
            'club_instance_id_2'
        )->withTimestamps();
    }

    public function mustGoWithClubs()
    {
        return $this->belongsToMany(
            ClubInstance::class,
            'must_go_with_clubs',
            'club_instance_id_1',
            'club_instance_id_2'
        )->withTimestamps();
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
