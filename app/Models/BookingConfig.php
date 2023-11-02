<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\YearGroup;
use App\Models\ClubInstance;

class BookingConfig extends Model
{
    use HasFactory;

    protected $fillable = ['scheduled_at', 'ends_at', 'name'];
    protected $casts = [
        'scheduled_at' => 'datetime:Y-m-d H:i:s',
        'ends_at' => 'datetime:Y-m-d H:i:s',
    ];

    // protected $hidden = ["allowedClubs", "pivot"];

    public static function bookingsAreOpen()
    {
        $latestConfig = self::latest('scheduled_at')->first();
        return $latestConfig ? $latestConfig->is_open : false;
    }

    public static function createFromJson($jsonPayload)
    {
        // Decode the JSON payload

        // die($data);

        // Begin a database transaction to ensure all operations are atomic
        // DB::beginTransaction();

        try {

            $d = Carbon::now();

            // die($d);
            // Log::info(Carbon::now());
            // Create a new booking config
            $bookingConfig = BookingConfig::create([
                'scheduled_at' => Carbon::now(),
                'ends_at' => Carbon::now()
            ]);
            die($bookingConfig);

            // Attach Clubs if specified, else attach all
            $clubs = $jsonPayload['clubs'] ?: ClubInstance::all()->pluck('id');
            $bookingConfig->allowedClubs()->attach($clubs);

            // Attach Year Groups
            $yearGroups = $jsonPayload['year_groups'] ?: YearGroup::all()->pluck('id');
            $bookingConfig->allowedYearGroups()->attach($yearGroups);

            // Attach Users if specified, else attach all
            $users = $jsonPayload['students'] ?: User::all()->pluck('id');
            $bookingConfig->allowedUsers()->attach($users);

            // Commit the transaction if everything is okay
            // DB::commit();

            return $bookingConfig;
        } catch (\Exception $e) {
            // Rollback the transaction in case of errors
            DB::rollback();
            throw $e;
        }
    }




    public function canUserBook($user)
    {
        return $this->allowedUsers->contains($user->id);
    }

    public function canYearGroupBook($yearGroupId)
    {
        return $this->allowedYearGroups->contains($yearGroupId);
    }

    public function canClubInstanceBook($clubInstanceId)
    {
        return $this->allowedClubs->contains($clubInstanceId);
    }

    public function allowedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'allowed_users', 'booking_config_id', 'user_id');
    }

    public function allowedYearGroups(): BelongsToMany
    {
        return $this->belongsToMany(YearGroup::class, 'allowed_year_groups', 'booking_config_id', 'year');
    }

    // TODO:
    // This might be wrong.
    public function allowedClubs(): BelongsToMany
    {
        return $this->belongsToMany(ClubInstance::class, 'allowed_club_instances', 'booking_config_id', 'club_instance_id');
    }

    public function isUserAllowedToBook($user)
    {
        return $this->allowedUsers->contains($user->id) || $this->allowedYearGroups->contains($user->year);
    }

    // protected static function booted()
    // {
    //     static::created(function ($bookingConfig) {

    //         // Associate with all Clubs
    //         $allClubs = ClubInstance::all()->pluck('id');
    //         $bookingConfig->allowedClubs()->attach($allClubs);

    //         // Associate with all Users
    //         $allUsers = User::all()->pluck('id');
    //         $bookingConfig->allowedUsers()->attach($allUsers);

    //         // Associate with all Year Groups
    //         $allYearGroups = YearGroup::all()->pluck('id');
    //         $bookingConfig->allowedYearGroups()->attach($allYearGroups);
    //     });
    // }
    public function toArray()
    {

        $data = parent::toArray();

        if ($this->allowedClubs) {
            // Extract 'half_term' values from the relationship
            $halfTermValues = $this->allowedClubs->pluck('half_term')->toArray();

            // Get unique 'half_term' values
            $uniqueHalfTermValues = array_unique($halfTermValues);

            // Rename 'allowed_clubs' to 'associated_terms' and update with unique values as a list
            $data['associated_terms'] = array_values($uniqueHalfTermValues);

            // Remove the 'allowed_clubs' column
            unset($data['allowed_clubs']);
        }

        return $data;
    }

}