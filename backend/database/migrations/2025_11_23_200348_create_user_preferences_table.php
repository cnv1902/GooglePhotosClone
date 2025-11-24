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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->enum('theme', ['light', 'dark', 'system'])->default('system');
            $table->string('language', 10)->default('vi');
            $table->string('timezone', 50)->default('Asia/Ho_Chi_Minh');
            $table->integer('items_per_page')->default(50);
            $table->boolean('auto_backup')->default(false);
            $table->integer('compression_quality')->default(85);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
