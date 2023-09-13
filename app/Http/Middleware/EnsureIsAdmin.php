<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureIsAdmin
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
        if (!Auth::check()) {
            // If the user is not logged in, redirect to login
            return redirect()->route('login');
        }

        if (Auth::user()->role != 1) {
            // If user is logged in but not an admin, redirect them to home or any other page
            return redirect()->route('dashboard')->with('error', 'You do not have admin access.');
        }

        return $next($request);
    }
}
