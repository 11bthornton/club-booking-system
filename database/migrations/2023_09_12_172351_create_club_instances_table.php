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
        Schema::create('club_instances', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('club_id');
            $table->foreign('club_id')->references('id')->on('clubs')->onDelete('cascade');
            $table->unsignedBigInteger('half_term');
            $table->unsignedBigInteger('capacity');
            $table->string('day_of_week');
    
            $table->timestamps();
    
            // Add unique constraint for club_id and day_of_week combination
            $table->unique(['club_id', 'day_of_week']);
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('club_instances');
    }
};
