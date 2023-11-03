<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\JsErrorLog;

class JSErrorLogController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request data
        $data = $request->validate([
            'error_message' => 'required|string',
            'component_stack' => 'required|string',
            'url' => 'required|url',
            'user_agent' => 'nullable|string',
        ]);

        // Create a new error log entry
        JsErrorLog::create($data);

        // You might want to return a response or just an acknowledgment
        return response()->json(['success' => true]);
    }
}
