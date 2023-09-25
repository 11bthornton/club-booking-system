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
        Schema::create('year_group_club', function (Blueprint $table) {
            $table->id();
            $table->string('year');
            $table->foreign('year')->references('year')->on('year_groups')->onDelete('cascade');
            
            $table->unsignedBigInteger('club_instance_id');
            $table->foreign('club_instance_id')->references('id')->on('club_instances')->onDelete('cascade');
            
            $table->timestamps();
    
            // Composite primary key
            // $table->primary(['year', 'club_instance_id']);
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('year_group_club');
    }
};
