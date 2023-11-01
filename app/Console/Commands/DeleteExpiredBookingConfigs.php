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

        // Delete expired booking configs and get the IDs of deleted records
        $deletedIds = BookingConfig::where('ends_at', '<', $now)->pluck('id')->toArray();

        // Delete the records
        BookingConfig::where('ends_at', '<', $now)->delete();

        // Check if any records were deleted and include their IDs in the message
        if (!empty($deletedIds)) {
            $message = 'Expired booking configs with IDs ' . implode(', ', $deletedIds) . ' have been deleted.';
        } else {
            $message = 'No expired booking configs found for deletion.';
        }

        $this->info($message);
    }

}