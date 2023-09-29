<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('booking_configs', function (Blueprint $table) {
            $table->dropColumn('is_open');
            $table->dateTime('ends_at');
            // Uncomment if you are using MySQL 8.0.16 or above
            // $table->check('ends_at > scheduled_at');
        });
    }

    public function down()
    {
        Schema::table('booking_configs', function (Blueprint $table) {
            $table->boolean('is_open')->default(false);
            $table->dropColumn('ends_at');
        });
    }
};
