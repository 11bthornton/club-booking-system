<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'year',
        'role',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        // 'role'
        // 'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // 'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function bookedClubs()
    {
        return $this->belongsToMany(
            \App\Models\ClubInstance::class,
            'user_club',
            'user_id',
            'club_instance_id'
        )->withTimestamps();
    }

    public function yearGroup()
    {
        return $this->belongsTo(YearGroup::class, 'year', 'year'); // Assuming 'year' is a foreign key in users table and primary/unique key in year_groups table
    }

    public function getOrganizedByTermAttribute()
    {
        return $this->organizedByTerm();
    }

    public function organizedByTerm()
    {
        $clubInstances = $this->bookedClubs()->get();

        $organizedByTerm = [];
        $daysOfWeek = ['Wednesday', 'Friday'];
        $maxTerms = 6;

        for ($term = 1; $term <= $maxTerms; $term++) {
            foreach ($daysOfWeek as $day) {
                $organizedByTerm[$term][$day] = null;
            }
        }

        foreach ($clubInstances as $instance) {
            $term = $instance->half_term;
            $dayOfWeek = $instance->day_of_week;

            $instance['club'] = Club::find($instance->club_id)->name;

            if (isset($organizedByTerm[$term]) && array_key_exists($dayOfWeek, $organizedByTerm[$term])) {
                $organizedByTerm[$term][$dayOfWeek] = $instance;
            }


        }

        return $organizedByTerm;
    }

}