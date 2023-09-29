<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Carbon\Carbon;

use App\Models\BookingConfig;

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

    protected $appends = ['can_book_clubs', 'next_booking_time'];

    public function canBookClubs()
    {
        return $this->checkIfUserCanBookClubs();
    }

    public function getCanBookClubsAttribute()
    {
        return $this->checkIfUserCanBookClubs();
    }

    public function getNextBookingTimeAttribute()
    {
        return $this->getNextBookingTime();
    }

    
    private function checkIfUserCanBookClubs()
    {

        // Get the latest BookingConfig where the current time falls within the scheduled_at and ends_at range.
        $currentBookingConfig = BookingConfig::where('scheduled_at', '<=', now())
            ->where('ends_at', '>=', now())
            ->latest()
            ->first();

        // If there's no active booking configuration, the user can't book.
        if (!$currentBookingConfig) {
            return false;
        }

        // Check if the user is allowed to book based on the AllowedUsers table.
        if ($currentBookingConfig->allowedUsers->contains($this->id)) {
            return true;
        }

        // Check if the user's year group is allowed to book based on the AllowedYearGroups table.
        if ($currentBookingConfig->allowedYearGroups->contains($this->year)) {
            return true;
        }

        return false;
    }

    private function getNextBookingTime()
    {
        $bookingConfigs = BookingConfig::where('scheduled_at', '>', Carbon::now())
            ->where('ends_at', '>', Carbon::now())
            ->orderBy('scheduled_at', 'asc')
            ->get();

        foreach ($bookingConfigs as $config) {
            if ($config->canUserBook($this) && $config->canYearGroupBook($this->year_group_id)) {
                return $config->scheduled_at;
            }
        }

        return null;
    }

}