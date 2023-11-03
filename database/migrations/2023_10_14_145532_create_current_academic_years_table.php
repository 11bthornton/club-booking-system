<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('current_academic_years', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('academic_year_id');
            $table->foreign('academic_year_id')
                ->references('id')
                ->on('academic_years')
                ->onDelete('cascade');
            $table->timestamps();
        });

        $academicYearId = DB::table('academic_years')->insertGetId([
            'year_start' => 23,
            'year_end' => 24,
            'term1_start' => '2023-01-01',
            'term1_name' => 'Autumn 1',
            'term2_start' => '2023-04-01',
            'term2_name' => 'Autumn 2',

            'term3_start' => '2023-07-01',
            'term3_name' => 'Winter 1',

            'term4_start' => '2023-10-01',
            'term4_name' => 'Winter 2',

            'term5_start' => '2024-01-01',
            'term5_name' => 'Spring 1',

            'term6_start' => '2024-04-01',
            'term6_name' => 'Spring 2',

            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Set the above year as the current academic year
        DB::table('current_academic_years')->insert([
            'academic_year_id' => $academicYearId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('current_academic_years');
    }
};