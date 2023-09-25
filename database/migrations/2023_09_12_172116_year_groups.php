<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('year_groups', function (Blueprint $table) {
            $table->id();
            $table->string('year')->unique();
            $table->timestamps();
        });

        // Inserting years 7-11 into the year_groups table
        for ($year = 7; $year <= 11; $year++) {
            DB::table('year_groups')->insert([
                'year' => (string) $year,
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
        //
    }
};
