<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Summary of UserClub
 */
class UserClub extends Model
{

    use HasFactory;
    
    /**
     * Summary of table
     * @var string
     */
    protected $table = 'user_club';

    /**
     * Summary of fillable
     * @var array
     */
    protected $fillable = ['user_id', 'club_instance_id'];

    /**
     * Summary of user
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Summary of clubInstance
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
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

        // die("hey");
        $clubInstance = $this->clubInstance;

        // die("hey!");

        if (!is_null($clubInstance->capacity)) {

            $clubInstance->increment('capacity');

        }

        return parent::delete();
    }
}