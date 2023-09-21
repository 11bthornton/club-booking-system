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
        Schema::table('club_instances', function (Blueprint $table) {
            // Make capacity nullable
            $table->unsignedBigInteger('capacity')->nullable()->change();

            // Add check constraint to ensure capacity is either NULL or positive
            DB::statement('ALTER TABLE club_instances ADD CONSTRAINT chk_positive_capacity CHECK (capacity IS NULL OR capacity > 0)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('club_instances_capacity', function (Blueprint $table) {
            //
        });
    }
};
