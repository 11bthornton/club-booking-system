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
        Schema::create('booking_configs', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_open')->default(false);  // false means booking is closed, true means it's open
            $table->timestamp('scheduled_at')->nullable();  // time at which the booking status should change, null means immediate
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_configs');
    }
};
