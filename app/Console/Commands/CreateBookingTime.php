<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\BookingConfig;
use Carbon\Carbon;


class CreateBookingTime extends Command
{

    protected $signature = 'booking:create';
    protected $description = 'Create a new booking time';


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $attributes = [
            'scheduled_at' => Carbon::now(),
            'ends_at' => Carbon::now()->addMinutes(10),
        ];
        
        BookingConfig::create($attributes);

        $this->info("Booking time created successfully.");
    }
}