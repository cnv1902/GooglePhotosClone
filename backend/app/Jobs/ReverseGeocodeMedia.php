<?php

namespace App\Jobs;

use App\Models\MediaFile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ReverseGeocodeMedia implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 30;

    public function __construct(public int $mediaId) {}

    public function handle(): void
    {
        $enabled = config('media.reverse_geocode_enabled');
        if (!$enabled) {
            return;
        }
        $media = MediaFile::find($this->mediaId);
        if (!$media || !$media->latitude || !$media->longitude || $media->location_name) {
            return; // nothing to do
        }
        try {
            $provider = config('media.reverse_geocode_provider');
            if ($provider === 'nominatim') {
                $url = 'https://nominatim.openstreetmap.org/reverse';
                $response = Http::withHeaders([
                    'User-Agent' => config('media.reverse_geocode_user_agent', 'GooglePhotosClone/1.0')
                ])->get($url, [
                    'lat' => $media->latitude,
                    'lon' => $media->longitude,
                    'format' => 'json',
                ]);
                if ($response->ok()) {
                    $data = $response->json();
                    $display = $data['display_name'] ?? null;
                    if ($display) {
                        $media->location_name = mb_substr($display, 0, 255);
                        $media->save();
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Reverse geocode error media '.$media->id.': '.$e->getMessage());
        }
    }
}
