<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIfUserCanBookClubs
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !$user->canBookClubs()) {
            // Redirect the user back to the home page or show an error message
            return redirect('/dashboard')->with('error', 'You are not eligible to book clubs.');
        }

        return $next($request);
    }
}
