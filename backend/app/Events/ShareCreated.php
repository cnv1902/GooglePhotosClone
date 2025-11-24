<?php

namespace App\Events;

use App\Models\Share;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ShareCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Share $share, public array $targetUserIds) {}

    public function broadcastOn(): array
    {
        return array_map(fn($id) => new PrivateChannel('App.Models.User.' . $id), $this->targetUserIds);
    }

    public function broadcastWith(): array
    {
        return [
            'share_id' => $this->share->id,
            'share_type' => $this->share->share_type,
            'shareable_type' => $this->share->shareable_type,
            'shareable_id' => $this->share->shareable_id,
        ];
    }
}
