<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClubInstance extends Model
{
    use HasFactory;

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function yearGroups()
    {
        return $this->belongsToMany(YearGroup::class, 'year_group_club', 'club_instance_id', 'year');
    }
    
}
