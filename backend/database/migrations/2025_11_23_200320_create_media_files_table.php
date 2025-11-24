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
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('original_name');
            $table->string('file_name')->unique();
            $table->string('file_path', 500);
            $table->string('thumbnail_path', 500)->nullable();
            $table->unsignedBigInteger('file_size');
            $table->string('mime_type', 100);
            $table->enum('file_type', ['image', 'video', 'gif']);
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedInteger('duration')->nullable();
            
            // Metadata từ EXIF
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('camera_make', 100)->nullable();
            $table->string('camera_model', 100)->nullable();
            $table->string('exposure_time', 50)->nullable();
            $table->string('aperture', 20)->nullable();
            $table->unsignedInteger('iso')->nullable();
            $table->string('focal_length', 20)->nullable();
            $table->timestamp('taken_at')->nullable();
            
            // Thông tin địa điểm
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('location_name')->nullable();
            
            $table->boolean('is_favorite')->default(false);
            $table->boolean('is_trashed')->default(false);
            $table->timestamp('trashed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
            
            $table->index(['user_id', 'created_at']);
            $table->index('taken_at');
            $table->index(['latitude', 'longitude']);
            $table->index(['is_trashed', 'trashed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
