<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Club;

class ClubController extends Controller
{
    /**
     * Update the specified club in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        // dd($request->all());

        // Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'string',
            'rule' => 'nullable|string',
            // Add other fields if necessary
        ]);

        // Fetch the club
        $club = Club::findOrFail($id);

        // Update the club
        $club->update($request->all());

        // Respond
        return response()->json(['message' => 'Club updated successfully!']);
    }

    public function store(Request $request)
{
try {
    // dd($request);

    $data = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'sometimes|string', // Assuming description can be optional
        'rule' => 'required'
    ]);

    $club = Club::create($data);

    if ($club) {
        return response()->json($club, 201);
    } else {
        return response()->json(['message' => 'Error creating club'], 500);
    }

} catch (\Exception $e) {
    return response()->json(['message' => 'Error creating club: ' . $e->getMessage()], 500);
}
}

}
