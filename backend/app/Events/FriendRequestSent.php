<?php

namespace App\Events;

use App\Models\Friendship;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FriendRequestSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Friendship $friendship) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel('App.Models.User.' . $this->friendship->friend_id);
    }

    public function broadcastWith(): array
    {
        return [
            'friendship_id' => $this->friendship->id,
            'from_user_id' => $this->friendship->user_id,
        ];
    }
}
