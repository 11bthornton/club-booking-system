<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use League\Csv\Writer;

use App\Models\User;
use App\Models\Club;
use App\Models\ClubInstance;
use App\Models\UserClub;
use App\Models\YearGroupDays;

use App\Exports\ClubExport;

use Maatwebsite\Excel\Facades\Excel;

class DataExportController extends Controller
{
    public function downloadTotalUserClubSpreadsheet(Request $request)
    {
        // Query your database to retrieve the data you want to include in the spreadsheet
        $users = User::getStudents(); // Replace YourModel with your actual model

        // Create a CSV writer
        $csv = Writer::createFromFileObject(new \SplTempFileObject());
        $availableDays = YearGroupDays::all();

        // Flatten the day_1 and day_2 into a single array
        $flattenedDays = $availableDays->flatMap(function ($yearGroupDay) {
            return [$yearGroupDay->day_1, $yearGroupDay->day_2];
        })->toArray();

        // Get unique days
        $uniqueDays = array_unique($flattenedDays);

        // If you need to reindex the array keys
        $uniqueDays = array_values($uniqueDays);

        $columnHeaders = ['first_name', 'second_name', 'year'];

        for ($i = 1; $i <= 6; $i++) {
            foreach ($uniqueDays as $day) {

                $columnHeaders[] = $day . " " . $i;
            }
        }


        // Insert the column headers into the CSV
        $csv->insertOne($columnHeaders);

        // Add data rows
        foreach ($users as $user) {
            $organizedByTerm = $user->organizedByTerm();

            $values = [
                $user->first_name,
                $user->second_name,
                $user->year,
            ];

            for ($term = 1; $term <= 6; $term++) {
                foreach ($uniqueDays as $day) {
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

    public function clubDataDownload(Request $request, $id)
    {

        return Excel::download(new ClubExport, 'exported_data.xlsx');

    }
}
