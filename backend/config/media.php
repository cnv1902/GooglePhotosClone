<?php

return [
    'default_compression_quality' => env('MEDIA_DEFAULT_COMPRESSION_QUALITY', 85),
    'trash_retention_days' => env('MEDIA_TRASH_RETENTION_DAYS', 30),
    'reverse_geocode_enabled' => env('MEDIA_REVERSE_GEOCODE_ENABLED', false),
    'reverse_geocode_provider' => env('MEDIA_REVERSE_GEOCODE_PROVIDER', 'nominatim'),
    'reverse_geocode_user_agent' => env('MEDIA_REVERSE_GEOCODE_UA', 'GooglePhotosClone/1.0'),
    'ffmpeg_path' => env('FFMPEG_PATH', 'ffmpeg'),
];
