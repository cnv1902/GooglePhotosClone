<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Album extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'cover_media_id',
        'is_auto_created',
        'auto_criteria',
    ];

    protected $casts = [
        'is_auto_created' => 'boolean',
        'auto_criteria' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function coverMedia()
    {
        return $this->belongsTo(MediaFile::class, 'cover_media_id');
    }

    public function mediaFiles()
    {
        return $this->belongsToMany(MediaFile::class, 'album_media', 'album_id', 'media_id')
            ->withPivot('added_by', 'added_at')
            ->withTimestamps();
    }

    public function shares()
    {
        return $this->morphMany(Share::class, 'shareable');
    }
}
