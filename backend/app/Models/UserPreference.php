<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'theme',
        'language',
        'timezone',
        'items_per_page',
        'auto_backup',
        'compression_quality',
    ];

    protected $casts = [
        'auto_backup' => 'boolean',
        'items_per_page' => 'integer',
        'compression_quality' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
