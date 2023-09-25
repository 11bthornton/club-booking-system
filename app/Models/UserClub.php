<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserClub extends Model
{

    use HasFactory;
    
    protected $table = 'user_club';

    protected $fillable = ['user_id', 'club_instance_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function clubInstance()
    {
        return $this->belongsTo(ClubInstance::class);
    }

    /**
     * This will delete the record of the booking but won't update the
     * leftover capacity in the club_instances table.
     */
    public function delete()
    {

        $clubInstance = $this->clubInstance;

        // die("hey!");

        if (!is_null($clubInstance->capacity)) {

            $clubInstance->increment('capacity');

        }

        return parent::delete();
    }
}