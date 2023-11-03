<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('year_start')->comment('e.g. 23 for 2023');
            $table->unsignedSmallInteger('year_end')->comment('e.g. 24 for 2024');
            
            // Columns for the start dates of each term
            $table->date('term1_start');
            $table->string("term1_name");

            $table->date('term2_start');
            $table->string("term2_name");

            $table->date('term3_start');
            $table->string("term3_name");

            $table->date('term4_start');
            $table->string("term4_name");

            $table->date('term5_start');
            $table->string("term5_name");

            $table->date('term6_start');
            $table->string("term6_name");

            $table->unique(['year_start', 'year_end']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_years');
    }
};
