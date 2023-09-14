<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('must_go_with_clubs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('club_instance_id_1');
            $table->unsignedBigInteger('club_instance_id_2');

            $table->foreign('club_instance_id_1')->references('id')->on('club_instances')->onDelete('cascade');
            $table->foreign('club_instance_id_2')->references('id')->on('club_instances')->onDelete('cascade');

            $table->unique(['club_instance_id_1', 'club_instance_id_2']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('must_go_with_clubs');
    }
};
