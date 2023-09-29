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
        Schema::create('allowed_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_config_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
    
            $table->foreign('booking_config_id')
                ->references('id')
                ->on('booking_configs')
                ->onDelete('cascade');
    
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allowed_users');
    }
};
