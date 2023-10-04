<?php

namespace App\Http\Controllers;

use App\Models\BookingConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use App\Models\ClubInstance;
use App\Models\YearGroup;
use App\Models\User;

class BookingConfigController extends Controller
{
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'formData.start_date' => 'required|date',
            'formData.end_date' => 'required|date',
            'formData.start_time' => 'required|date_format:H:i',
            'formData.end_time' => 'required|date_format:H:i',
            'formData.year_groups' => 'array',
            'formData.clubs' => 'array',
            'formData.students' => 'array',
        ]);
    
        $validator->after(function ($validator) use ($request) {
            $formData = $request->json()->all()['formData'];
            $startDate = \Carbon\Carbon::parse($formData['start_date'] . ' ' . $formData['start_time']);
            $endDate = \Carbon\Carbon::parse($formData['end_date'] . ' ' . $formData['end_time']);
    
            if ($endDate->lt($startDate)) {
                $validator->errors()->add('formData.end_time', 'The end time must be after the start time.');
            }
        });
    
        if ($validator->fails()) {
            return response()->json([
                'status' => "error",
                'message' => $validator->errors(),
                'data' => []
            ]);
        }

        DB::beginTransaction();
    
        try {
     
            $jsonData = $request->json()->all()['formData'];

            $startDate = \Carbon\Carbon::parse($jsonData['start_date'] . ' ' . $jsonData['start_time']);
            $endDate = \Carbon\Carbon::parse($jsonData['end_date'] . ' ' . $jsonData['end_time']);

            $bookingConfig = BookingConfig::create([
                'scheduled_at' => $startDate,
                'ends_at' => $endDate
            ]);

            $clubs = $jsonData['clubs'] ?: ClubInstance::all()->pluck('id');
            $bookingConfig->allowedClubs()->attach($clubs);

            $yearGroups = $jsonData['year_groups'] ?: YearGroup::all()->pluck('year');
            $bookingConfig->allowedYearGroups()->attach($yearGroups);

            $users = $jsonData['students'] ?: User::all()->pluck('id');
            // $bookingConfig->allowedUsers()->attach($users);

            // Commit the transaction if everything is okay
            DB::commit();

            return response()->json(
                [
                    'status' => "success",
                    'message' => 'Successfully Scheduled System Uptime',
                    'data' => [
                        'bookingConfig' => $bookingConfig
                    ]
                ]
            );
        } catch (\Exception $e) {
            // Rollback the transaction in case of errors
            DB::rollback();
        
            return response()->json(
                [
                    'status' => "error",
                    'message' => $e->getMessage(),
                    'data' => []
                ]
            );
        }
    }

}
