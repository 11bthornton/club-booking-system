<?php

namespace App\Http\Controllers;

use App\Models\BookingConfig;
use App\Models\Club;
use App\Models\YearGroupDays;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use App\Rules\ValidBookingScheduleTime;

use App\Models\ClubInstance;
use App\Models\YearGroup;
use Inertia\Inertia;

class BookingConfigController extends Controller
{
    public function create(Request $request)
    {
        $rules = [
            'name' => 'required|string|min:3',
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date_format:H:i',
            'end_time' => ['required', 'date_format:H:i', new ValidBookingScheduleTime],
            'year_groups' => 'required|array|min:1',
            'year_groups.*' => 'in:7,8,9,10,11',
            'clubs' => 'required|array|min:1',
            'clubs.*' => ['required', 'exists:club_instances,id'],
        ];
    
        $data = $request->validate($rules);

        DB::beginTransaction();

        try {

            $startDate = \Carbon\Carbon::parse($data['start_date'] . ' ' . $data['start_time']);
            $endDate = \Carbon\Carbon::parse($data['end_date'] . ' ' . $data['end_time']);

            $bookingConfig = BookingConfig::create([
                'scheduled_at' => $startDate,
                'ends_at' => $endDate,
                'name' => $data['name']
            ]);

            $clubs = $data['clubs'] ?: ClubInstance::all()->pluck('id');
            $bookingConfig->allowedClubs()->attach($clubs);

            $yearGroups = $data['year_groups'] ?: YearGroup::all()->pluck('year');
            $bookingConfig->allowedYearGroups()->attach($yearGroups);

            // $users = $data['students'] ?: User::all()->pluck('id');
            // $bookingConfig->allowedUsers()->attach($users);

            // Commit the transaction if everything is okay
            DB::commit();

            $bookingConfigs = BookingConfig::all();

            $bookingConfigs->map(function ($config) {
                $now = Carbon::now();
                $scheduledAt = Carbon::parse($config->scheduled_at);
                $endsAt = Carbon::parse($config->ends_at);

                $config->isLive = $now->between($scheduledAt, $endsAt);
                return $config;
            });
            $bookingConfigs = $bookingConfigs->sortBy('scheduled_at');
            // dd($bookingConfigs);

            $clubs = Club::getAllWithInstances();

            return Redirect::route('admin.booking-config.index', [
                'scheduleData' => $bookingConfigs,
                'clubData' => $clubs,
                'availableDays' => YearGroupDays::all()
            ]);

        } catch (\Exception $e) {
            // Rollback the transaction in case of errors
            // DB::rollback();
            die($e->getMessage());
            
        }
    }

    public function delete($id) {
            $bookingConfig = BookingConfig::findOrFail($id);

            $bookingConfig->delete();
            
            
            $this->index();
    }

    public function index()
    {

        $bookingConfigs = BookingConfig::all();

        $bookingConfigs = $bookingConfigs->map(function ($config) {
            // Parse the scheduled_at field into a timestamp
            $config->scheduled_at_timestamp = strtotime($config->scheduled_at);
        
            // Parse the ends_at field into a timestamp
            $config->ends_at_timestamp = strtotime($config->ends_at);
        
            // Calculate the isLive attribute
            $now = time();
            $config->isLive = ($now >= $config->scheduled_at_timestamp && $now <= $config->ends_at_timestamp);
        
            return $config;
        });
        
        // Sort the collection by scheduled_at_timestamp in ascending order
        $bookingConfigs = $bookingConfigs->sortByDesc('scheduled_at');

        $clubs = Club::getAllWithInstances();
        // dd($bookingConfigs);


        return Inertia::render('AdminBoard/BookingConfigs/BookingConfigs', [
            'scheduleData' => $bookingConfigs,
            'clubData' => $clubs,
            'availableDays' => YearGroupDays::all()
        ]);
    }

}
