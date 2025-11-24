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
        if (Schema::hasTable('share_users')) {
            Schema::table('share_users', function (Blueprint $table) {
                if (!Schema::hasColumn('share_users', 'created_at')) {
                    $table->timestamps();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('share_users')) {
            Schema::table('share_users', function (Blueprint $table) {
                if (Schema::hasColumn('share_users', 'created_at')) {
                    $table->dropColumn(['created_at', 'updated_at']);
                }
            });
        }
    }
};
