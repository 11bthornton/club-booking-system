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
        Schema::create('allowed_club_instances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_config_id');
            $table->unsignedBigInteger('club_instance_id');
            $table->timestamps();
    
            $table->foreign('booking_config_id')
                ->references('id')
                ->on('booking_configs')
                ->onDelete('cascade');
    
            $table->foreign('club_instance_id')
                ->references('id')
                ->on('club_instances')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allowed_club_instances');
    }
};
