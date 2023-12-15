<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('email')->unique()->nullable();
            $table->string('first_name')->nullable();
            $table->string('second_name')->nullable();
            $table->timestamps();
            $table->string('year');
            $table->string('role');
            $table->foreign('year')->references('year')->on('year_groups');
        });

        DB::table('users')->insert([
            'username' => 'admin',
            'password' => Hash::make('dIP7O#9tha87LhEwrl#i'),
            'year' => "7", // replace this with the appropriate year value
            'role' => "1", // replace this with the appropriate role value
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
