<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use Carbon\Carbon;
use App\Models\BookingConfig;

class CheckBookingStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Fetch the latest configuration record
        $config = BookingConfig::latest()->first();
        
        if (!$config) {
            // If no config is set, you can decide to allow or deny the request
            // Here, we are allowing it
            return $next($request);
            // return abort(403, 'Bookings are currently closed');
        }

        $currentTime = Carbon::now();
        $scheduledTime = Carbon::createFromTimestamp($config->scheduled_at);

        // If booking is open, or it's scheduled to open and the time has come
        if ($config->is_open || ($config->scheduled_at && $currentTime->greaterThanOrEqualTo($scheduledTime))) {
            return $next($request);
        }

        // You can also return a JSON response or redirect as per your needs
        return abort(403, 'Bookings are currently closed');
    }
}