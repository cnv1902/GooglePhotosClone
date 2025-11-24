<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class Share extends Model
{
    use HasFactory;

    protected $fillable = [
        'shareable_type',
        'shareable_id',
        'shared_by',
        'share_type',
        'token',
        'expires_at',
        'password',
        'allow_download',
        'view_count',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'allow_download' => 'boolean',
        'view_count' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        
        // Map morph types
        Relation::enforceMorphMap([
            'media' => MediaFile::class,
            'album' => Album::class,
        ]);
    }

    public function shareable()
    {
        return $this->morphTo();
    }

    public function sharedBy()
    {
        return $this->belongsTo(User::class, 'shared_by');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'share_users')
            ->withPivot('can_edit', 'can_share')
            ->withTimestamps();
    }
}
