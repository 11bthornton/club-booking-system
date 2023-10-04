<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use Inertia\Inertia;

class AddCsrfToInertiaResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        if ($request->header('X-Inertia')) {
            // die();
            $newToken = csrf_token();
            $response->headers->set('X-CSRF-TOKEN', $newToken);
            // die('Setting CSRF: '.$newToken);
        }

        return $response;
    }
}
