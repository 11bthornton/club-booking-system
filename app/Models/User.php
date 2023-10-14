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
        'activeBookingConfigs',
        'userFutureBookingConfigs'
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

    // protected $appends = ['can_book_clubs', 'next_booking_time'];

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

    
    /**
     * Eligible to book SOME clubs
     */
    private function checkIfUserCanBookClubs()
    {

        // dd(BookingConfig::all());

        // Get all BookingConfigs where the current time falls within the scheduled_at and ends_at range.
        $currentBookingConfigs = BookingConfig::where('scheduled_at', '<=', now())
            ->where('ends_at', '>=', now())
            ->get();


        // dd($currentBookingConfigs);

        // If there's no active booking configuration, the user can't book.
        if ($currentBookingConfigs->isEmpty()) {
            return false;
        }

        foreach ($currentBookingConfigs as $currentBookingConfig) {
            // Use the relation method to check if the user is allowed to book
            if ($currentBookingConfig->isUserAllowedToBook($this)) {
                return true;
            }
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

    public function activeBookingConfigs()
{
    return $this->belongsToMany(
        BookingConfig::class,
        'allowed_users', 
        'user_id', 
        'booking_config_id'
    )->where('scheduled_at', '<=', now())
    ->where('ends_at', '>', now());
}

public function userFutureBookingConfigs()
{
    return $this->belongsToMany(
        BookingConfig::class,
        'allowed_users',
        'user_id',
        'booking_config_id'
    )->where('scheduled_at', '>', now())
    ->where('ends_at', '>', now());
}

public function getAllActiveBookingConfigs()
{
    // BookingConfigs related to the user
    $userBookingConfigs = $this->activeBookingConfigs->sortByDesc('ends_at');
    $userFutureBookingConfigs = $this->userFutureBookingConfigs->sortBy('scheduled_at');
    // die($userBookingConfigs);

    // BookingConfigs related to the user's year group
    $yearGroup = $this->yearGroup;  // Assuming the relationship is called "yearGroup"
    $yearGroupBookingConfigs = $yearGroup ? $yearGroup->activeBookingConfigs->sortByDesc('ends_at') : collect();
    $yearGroupFutureBookingConfigs = $yearGroup ? $yearGroup->futureBookingConfigs->sortBy('scheduled_at') : collect();


    // die()

    // Combine and remove duplicates
    $allBookingConfigs = $userBookingConfigs->concat($yearGroupBookingConfigs)->unique('id');
    $allFutureConfigs = $userFutureBookingConfigs->concat($yearGroupFutureBookingConfigs)->unique('id');

    $this->bookingConfigs = $allBookingConfigs;
    $this->futureBookingConfigs = $allFutureConfigs;

    return $allBookingConfigs;
}


    public function bookingConfigs()
{
    return $this->belongsToMany(
        BookingConfig::class,
        'allowed_users',  // name of the pivot table
        'user_id',  // foreign key on the pivot table that references this model's table
        'booking_config_id'  // foreign key on the pivot table that references the related model's table
    );
}

public function toArray()
    {
        $data = parent::toArray();

        // Customize the 'bookingConfigs' attribute
        if (isset($data['bookingConfigs'])) {
            foreach ($data['bookingConfigs'] as &$bookingConfig) {
                // Keep only the desired fields in 'bookingConfigs'
                $bookingConfig = [
                    'id' => $bookingConfig['id'],
                    'scheduled_at' => $bookingConfig['scheduled_at'],
                    'created_at' => $bookingConfig['created_at'],
                    'updated_at' => $bookingConfig['updated_at'],
                    'ends_at' => $bookingConfig['ends_at'],
                ];
            }
        }

        if (isset($data['futureBookingConfigs'])) {
            foreach ($data['futureBookingConfigs'] as &$bookingConfig) {
                // Keep only the desired fields in 'bookingConfigs'
                $bookingConfig = [
                    'id' => $bookingConfig['id'],
                    'scheduled_at' => $bookingConfig['scheduled_at'],
                    'created_at' => $bookingConfig['created_at'],
                    'updated_at' => $bookingConfig['updated_at'],
                    'ends_at' => $bookingConfig['ends_at'],
                ];
            }
        }

        return $data;
    }
}