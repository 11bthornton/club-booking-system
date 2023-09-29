<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;

use App\Models\BookingConfig;

class DeleteExpiredBookingConfigs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'booking-config:delete-expired';

    /**
     * Execute the console command.
     */
    protected $description = 'Delete expired booking configs';

    public function handle()
    {
        $now = Carbon::now();
        BookingConfig::where('ends_at', '<', $now)->delete();

        $this->info('Expired booking configs have been deleted.');
    }
}