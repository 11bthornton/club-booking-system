<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use League\Csv\Writer;

use App\Models\User;
use App\Models\Club;
use App\Models\ClubInstance;
use App\Models\UserClub;
use App\Models\YearGroupClub;

use App\Exports\ClubExport;

use Maatwebsite\Excel\Facades\Excel;

class DataExportController extends Controller
{
    public function downloadTotalUserClubSpreadsheet(Request $request)
    {
        // Query your database to retrieve the data you want to include in the spreadsheet
        $users = User::all(); // Replace YourModel with your actual model

        // Create a CSV writer
        $csv = Writer::createFromFileObject(new \SplTempFileObject());

        // Add a header row (optional)
        $csv->insertOne([
            'first_name', 'second_name', 'year',
            'Wednesday 1',
            'Friday 1',
            'Wednesday 2',
            'Friday 2',
            'Wednesday 3',
            'Friday 3',
            'Wednesday 4',
            'Friday 4',
            'Wednesday 5',
            'Friday 5',
            'Wednesday 6',
            'Friday 6',

        ]); // Customize column headers

        // Add data rows
        foreach ($users as $user) {
            $organizedByTerm = $user->organizedByTerm();
            
            $values = [
                $user->first_name,
                $user->second_name,
                $user->year,
            ];
        
            for ($term = 1; $term <= 6; $term++) {
                foreach (['Wednesday', 'Friday'] as $day) {
                    $value = $organizedByTerm[$term][$day] ? ($organizedByTerm[$term][$day]->club ? $organizedByTerm[$term][$day]->club->name : "None Selected") : "None Selected";
                    $values[] = $value;
                }
            }
        
            $csv->insertOne($values);
        }

        // Set the response headers for download
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="all_users.csv"',
        ];

        // Stream the CSV to the response
        return response()->stream(
            function () use ($csv) {
                $csv->output();
            },
            200,
            $headers
        );
    }

    public function clubDataDownload(Request $request, $id) {

        return Excel::download(new ClubExport, 'exported_data.xlsx');

    }
}
