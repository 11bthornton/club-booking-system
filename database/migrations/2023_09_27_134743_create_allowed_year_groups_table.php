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
        Schema::create('allowed_year_groups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_config_id');
            $table->string('year');  // Note that this is now string
            $table->timestamps();
    
            $table->foreign('booking_config_id')
                ->references('id')
                ->on('booking_configs')
                ->onDelete('cascade');
    
            $table->foreign('year')
                ->references('year')
                ->on('year_groups')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allowed_year_groups');
    }
};
