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
        Schema::create('shares', function (Blueprint $table) {
            $table->id();
            $table->enum('shareable_type', ['media', 'album']);
            $table->unsignedBigInteger('shareable_id');
            $table->foreignId('shared_by')->constrained('users')->onDelete('cascade');
            $table->enum('share_type', ['public_link', 'specific_users']);
            $table->string('token', 100)->unique()->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->string('password')->nullable();
            $table->boolean('allow_download')->default(true);
            $table->unsignedInteger('view_count')->default(0);
            $table->timestamps();
            
            $table->index('token');
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shares');
    }
};
