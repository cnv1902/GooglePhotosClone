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
        if (!Schema::hasTable('album_media')) {
            return;
        }

        Schema::table('album_media', function (Blueprint $table) {
            // Only add timestamps if they don't exist already
            if (!Schema::hasColumn('album_media', 'created_at') && !Schema::hasColumn('album_media', 'updated_at')) {
                $table->timestamps();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('album_media')) {
            return;
        }

        Schema::table('album_media', function (Blueprint $table) {
            if (Schema::hasColumn('album_media', 'created_at') && Schema::hasColumn('album_media', 'updated_at')) {
                $table->dropTimestamps();
            }
        });
    }
};
