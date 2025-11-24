<?php

namespace App\Events;

use App\Models\MediaFile;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UploadCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public MediaFile $media) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel('App.Models.User.' . $this->media->user_id);
    }

    public function broadcastWith(): array
    {
        return [
            'media_id' => $this->media->id,
            'original_name' => $this->media->original_name,
            'file_type' => $this->media->file_type,
        ];
    }
}
