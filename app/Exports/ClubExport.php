<?php

// app/Exports/ClubExport.php

namespace App\Exports;

use App\Models\Club;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ClubExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        // Retrieve the data you want to export here
        $clubs = Club::all();

        // Transform the data into the desired format
        $exportData = [];

        foreach ($clubs as $club) {
            $row = [
                'Club Name' => $club->name,
            ];

            // Get unique instance numbers for this club
            $instanceNumbers = $club->clubInstances->pluck('id')->unique();

            // Add columns for instances dynamically
            foreach ($instanceNumbers as $instanceNumber) {
                $instanceName = "Instance {$instanceNumber}";
                $users = $club->clubInstances->where('id', $instanceNumber)->first()->users->pluck('name')->implode(', ');
                dd($users);
                $row[$instanceName] = $users;
            }

            $exportData[] = $row;
        }

        return collect($exportData);
    }

    public function headings(): array
    {
        // Define the headers for the export
        $headers = ['Club Name'];

        // Get the maximum instance number from the database
        $maxInstanceNumber = Club::with('clubInstances')->get()->flatMap(function ($club) {
            return $club->clubInstances->pluck('id');
        })->max();

        // Add columns for instances dynamically
        for ($i = 1; $i <= $maxInstanceNumber; $i++) {
            $headers[] = "Instance {$i}";
        }

        return $headers;
    }
}
