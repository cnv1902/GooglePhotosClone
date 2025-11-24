<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MediaFile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'original_name',
        'file_name',
        'file_path',
        'thumbnail_path',
        'file_size',
        'mime_type',
        'file_type',
        'width',
        'height',
        'duration',
        'title',
        'description',
        'camera_make',
        'camera_model',
        'exposure_time',
        'aperture',
        'iso',
        'focal_length',
        'taken_at',
        'latitude',
        'longitude',
        'location_name',
        'is_favorite',
        'is_trashed',
        'trashed_at',
    ];

    protected $casts = [
        'taken_at' => 'datetime',
        'trashed_at' => 'datetime',
        'is_favorite' => 'boolean',
        'is_trashed' => 'boolean',
        'file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'duration' => 'integer',
        'iso' => 'integer',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function albums()
    {
        return $this->belongsToMany(Album::class, 'album_media', 'media_id', 'album_id')
            ->withPivot('added_by', 'added_at')
            ->withTimestamps();
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'media_tags');
    }

    public function shares()
    {
        return $this->morphMany(Share::class, 'shareable');
    }
}
