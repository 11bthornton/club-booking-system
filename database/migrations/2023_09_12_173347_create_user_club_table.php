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
        Schema::create('user_club', function (Blueprint $table) {
            
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('club_instance_id');
            $table->foreign('club_instance_id')->references('id')->on('club_instances')->onDelete('cascade');
            $table->timestamps();

            // $table->primary(['user_id', 'club_instance_id']);

            // // User can't book a club on the same day for a given half term:
            // // E
            // $table->unique(['user_id', 'half_term', 'day_of_week'], 'user_half_term_day_unique');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_club');
    }
};
