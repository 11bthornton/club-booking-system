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
        Schema::table('user_club', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['club_instance_id']);
            $table->dropPrimary(['user_id', 'club_instance_id']);
        });

        Schema::table('user_club', function (Blueprint $table) {
            $table->bigIncrements('id')->first();
        });

        Schema::table('user_club', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('club_instance_id')->references('id')->on('club_instances')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_club', function (Blueprint $table) {
            //
        });
    }
};
