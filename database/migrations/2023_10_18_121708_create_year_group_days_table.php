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
        Schema::create('year_group_days', function (Blueprint $table) {
            $table->id();
            $table->string('year'); // Add year field
            $table->string('day_1'); // Add day 1 field
            $table->string('day_2'); // Add day 2 field
            $table->timestamps();

            // Define foreign key constraint for 'year_id'
            $table->foreign('year')
                ->references('year')
                ->on('year_groups')
                ->onDelete('cascade');
        });

        // Add filler data for years 7-11
        for ($year = 7; $year <= 11; $year++) {
            DB::table('year_group_days')->insert([
                'year' => $year,
                'day_1' => 'Wednesday',
                'day_2' => 'Friday',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('year_group_days');
    }
};