<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    // Lấy danh sách bạn bè
    public function index(Request $request)
    {
        $user = Auth::user();
        $status = $request->get('status', 'accepted');
        
        $friendships = Friendship::where(function($query) use ($user, $status) {
            $query->where('user_id', $user->id)
                  ->orWhere('friend_id', $user->id);
        })->where('status', $status)->with(['user', 'friend'])->get();
        
        $friends = $friendships->map(function($friendship) use ($user) {
            $friend = $friendship->user_id == $user->id ? $friendship->friend : $friendship->user;
            return [
                'id' => $friend->id,
                'name' => $friend->name,
                'email' => $friend->email,
                'avatar' => $friend->avatar,
                'friendship_id' => $friendship->id,
                'status' => $friendship->status,
            ];
        });
        
        return response()->json($friends);
    }

    // Gửi lời mời kết bạn
    public function sendRequest(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);
        
        $user = Auth::user();
        $friendId = $request->friend_id;
        
        if ($user->id == $friendId) {
            return response()->json(['message' => 'Không thể kết bạn với chính mình'], 400);
        }
        
        // Kiểm tra đã có friendship chưa
        $existing = Friendship::where(function($query) use ($user, $friendId) {
            $query->where('user_id', $user->id)->where('friend_id', $friendId)
                  ->orWhere('user_id', $friendId)->where('friend_id', $user->id);
        })->first();
        
        if ($existing) {
            if ($existing->status === 'blocked') {
                return response()->json(['message' => 'Không thể gửi yêu cầu kết bạn'], 403);
            }
            return response()->json(['message' => 'Đã có yêu cầu kết bạn'], 400);
        }
        
        $friendship = Friendship::create([
            'user_id' => $user->id,
            'friend_id' => $friendId,
            'status' => 'pending',
        ]);

        // Broadcast friend request
        event(new \App\Events\FriendRequestSent($friendship));
        
        // Tạo thông báo
        Notification::create([
            'user_id' => $friendId,
            'type' => 'friend_request',
            'title' => 'Lời mời kết bạn',
            'message' => $user->name . ' đã gửi lời mời kết bạn',
            'data' => ['friendship_id' => $friendship->id, 'user_id' => $user->id],
        ]);
        
        return response()->json(['message' => 'Đã gửi lời mời kết bạn', 'friendship' => $friendship]);
    }

    // Chấp nhận lời mời kết bạn
    public function acceptRequest(Request $request)
    {
        $request->validate([
            'friendship_id' => 'required|exists:friendships,id',
        ]);
        
        $user = Auth::user();
        $friendship = Friendship::findOrFail($request->friendship_id);
        
        if ($friendship->friend_id != $user->id) {
            return response()->json(['message' => 'Không có quyền'], 403);
        }
        
        $friendship->status = 'accepted';
        $friendship->save();
        
        // Tạo thông báo
        Notification::create([
            'user_id' => $friendship->user_id,
            'type' => 'friend_accepted',
            'title' => 'Chấp nhận kết bạn',
            'message' => $user->name . ' đã chấp nhận lời mời kết bạn',
            'data' => ['friendship_id' => $friendship->id, 'user_id' => $user->id],
        ]);
        
        return response()->json(['message' => 'Đã chấp nhận lời mời kết bạn', 'friendship' => $friendship]);
    }

    // Từ chối/Xóa bạn
    public function removeFriend(Request $request)
    {
        $request->validate([
            'friendship_id' => 'required|exists:friendships,id',
        ]);
        
        $user = Auth::user();
        $friendship = Friendship::findOrFail($request->friendship_id);
        
        if ($friendship->user_id != $user->id && $friendship->friend_id != $user->id) {
            return response()->json(['message' => 'Không có quyền'], 403);
        }
        
        $friendship->delete();
        
        return response()->json(['message' => 'Đã xóa bạn']);
    }

    // Block bạn
    public function blockFriend(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);
        
        $user = Auth::user();
        $friendId = $request->friend_id;
        
        $friendship = Friendship::where(function($query) use ($user, $friendId) {
            $query->where('user_id', $user->id)->where('friend_id', $friendId)
                  ->orWhere('user_id', $friendId)->where('friend_id', $user->id);
        })->first();
        
        if ($friendship) {
            $friendship->status = 'blocked';
            $friendship->blocked_by = $user->id;
            $friendship->save();
        } else {
            $friendship = Friendship::create([
                'user_id' => $user->id,
                'friend_id' => $friendId,
                'status' => 'blocked',
                'blocked_by' => $user->id,
            ]);
        }
        
        return response()->json(['message' => 'Đã chặn người dùng', 'friendship' => $friendship]);
    }

    // Unblock bạn
    public function unblockFriend(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);
        
        $user = Auth::user();
        $friendId = $request->friend_id;
        
        $friendship = Friendship::where(function($query) use ($user, $friendId) {
            $query->where('user_id', $user->id)->where('friend_id', $friendId)
                  ->orWhere('user_id', $friendId)->where('friend_id', $user->id);
        })->where('status', 'blocked')
          ->where('blocked_by', $user->id)
          ->first();
        
        if (!$friendship) {
            return response()->json(['message' => 'Không tìm thấy người dùng bị chặn'], 404);
        }
        
        $friendship->delete();
        
        return response()->json(['message' => 'Đã bỏ chặn người dùng']);
    }

    // Tìm kiếm người dùng
    public function searchUsers(Request $request)
    {
        $query = $request->get('q', '');
        $user = Auth::user();
        
        if (empty($query) || strlen(trim($query)) < 2) {
            return response()->json([]);
        }
        
        $query = trim($query);
        
        // Tìm kiếm user - không loại trừ user đã có friendship để có thể xem trạng thái
        $usersQuery = User::where('id', '!=', $user->id)
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            });
        
        // Kiểm tra xem column is_active có tồn tại không bằng Schema
        if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'is_active')) {
            $usersQuery->where('is_active', true);
        }
        
        // Chỉ lấy avatar nếu cột tồn tại
        $columns = ['id', 'name', 'email'];
        if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'avatar')) {
            $columns[] = 'avatar';
        }
        
        $users = $usersQuery
            ->limit(20)
            ->get($columns);
        
        // Thêm thông tin friendship status nếu có
        $users = $users->map(function($u) use ($user) {
            $friendship = Friendship::where(function($q) use ($user, $u) {
                $q->where('user_id', $user->id)->where('friend_id', $u->id)
                  ->orWhere('user_id', $u->id)->where('friend_id', $user->id);
            })->first();
            
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'avatar' => $u->avatar ?? null,
                'friendship' => $friendship ? [
                    'id' => $friendship->id,
                    'status' => $friendship->status,
                    'user_id' => $friendship->user_id,
                ] : null,
            ];
        });
        
        return response()->json($users);
    }

    // Lấy danh sách gợi ý kết bạn
    public function getSuggestedUsers(Request $request)
    {
        $user = Auth::user();
        $limit = $request->get('limit', 10);
        
        // Lấy danh sách user đã có friendship (các user_id và friend_id liên quan)
        $friendRelations = Friendship::where(function($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhere('friend_id', $user->id);
        })->get(['user_id', 'friend_id']);

        $friendIds = collect();
        foreach ($friendRelations as $fr) {
            $friendIds->push($fr->user_id);
            $friendIds->push($fr->friend_id);
        }

        $friendIds = $friendIds->unique()->filter()->values()->toArray();
        // đảm bảo loại bỏ chính user hiện tại
        $friendIds = array_diff($friendIds, [$user->id]);

        // Lấy các user chưa là bạn (hoặc chưa có quan hệ) - hiển thị tất cả người dùng khác nếu muốn
        $usersQuery = User::where('id', '!=', $user->id)
            ->whereNotIn('id', $friendIds);
        
        // Kiểm tra xem column is_active có tồn tại không bằng Schema
        if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'is_active')) {
            $usersQuery->where('is_active', true);
        }
        
        // Chỉ lấy avatar nếu cột tồn tại
        $columns = ['id', 'name', 'email'];
        if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'avatar')) {
            $columns[] = 'avatar';
        }
        
        $users = $usersQuery
            ->inRandomOrder()
            ->limit($limit)
            ->get($columns);
        
        return response()->json($users);
    }

    // Lấy danh sách lời mời kết bạn đang chờ
    public function getPendingRequests(Request $request)
    {
        $user = Auth::user();
        
        $friendships = Friendship::where('friend_id', $user->id)
            ->where('status', 'pending')
            ->with('user')
            ->get();
        
        $requests = $friendships->map(function($friendship) {
            return [
                'id' => $friendship->id,
                'user' => [
                    'id' => $friendship->user->id,
                    'name' => $friendship->user->name,
                    'email' => $friendship->user->email,
                    'avatar' => $friendship->user->avatar,
                ],
                'created_at' => $friendship->created_at,
            ];
        });
        
        return response()->json($requests);
    }
}
