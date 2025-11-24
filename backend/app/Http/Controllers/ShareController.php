<?php

namespace App\Http\Controllers;

use App\Models\Share;
use App\Models\MediaFile;
use App\Models\Album;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ShareController extends Controller
{
    // Tạo link chia sẻ công khai
    public function createPublicLink(Request $request)
    {
        $request->validate([
            'shareable_type' => 'required|in:media,album',
            'shareable_id' => 'required',
            'expires_at' => 'nullable|date',
            'expires_in_days' => 'nullable|integer|min:1|max:365',
            'password' => 'nullable|string|max:255',
            'allow_download' => 'boolean',
        ]);

        $user = Auth::user();
        
        // Kiểm tra quyền sở hữu
        if ($request->shareable_type === 'media') {
            $shareable = MediaFile::where('user_id', $user->id)->findOrFail($request->shareable_id);
        } else {
            $shareable = Album::where('user_id', $user->id)->findOrFail($request->shareable_id);
        }

        // Xử lý expires_at từ expires_in_days hoặc expires_at
        $expiresAt = null;
        if ($request->has('expires_in_days') && $request->expires_in_days) {
            $expiresAt = now()->addDays($request->expires_in_days);
        } elseif ($request->has('expires_at') && $request->expires_at) {
            $expiresAt = $request->expires_at;
        }

        $share = Share::create([
            'shareable_type' => $request->shareable_type, // 'media' or 'album'
            'shareable_id' => $request->shareable_id,
            'shared_by' => $user->id,
            'share_type' => 'public_link',
            'token' => Str::random(32),
            'expires_at' => $expiresAt,
            'password' => $request->password ? bcrypt($request->password) : null,
            'allow_download' => $request->get('allow_download', true),
        ]);

        return response()->json([
            'message' => 'Đã tạo link chia sẻ',
            'share' => $share,
            'token' => $share->token,
            'share_url' => url('/shared/' . $share->token)
        ]);
    }

    // Chia sẻ với bạn bè
    public function shareWithFriends(Request $request)
    {
        $request->validate([
            'shareable_type' => 'required|in:media,album',
            'shareable_id' => 'required',
            'friend_ids' => 'required|array',
            'friend_ids.*' => 'exists:users,id',
            'can_edit' => 'boolean',
            'can_share' => 'boolean',
        ]);

        $user = Auth::user();
        
        // Kiểm tra quyền sở hữu
        if ($request->shareable_type === 'media') {
            $shareable = MediaFile::where('user_id', $user->id)->findOrFail($request->shareable_id);
        } else {
            $shareable = Album::where('user_id', $user->id)->findOrFail($request->shareable_id);
        }

        $share = Share::create([
            'shareable_type' => $request->shareable_type, // 'media' or 'album'
            'shareable_id' => $request->shareable_id,
            'shared_by' => $user->id,
            'share_type' => 'specific_users',
        ]);

        // Thêm bạn bè vào share
        foreach ($request->friend_ids as $friendId) {
            $share->users()->attach($friendId, [
                'can_edit' => $request->get('can_edit', false),
                'can_share' => $request->get('can_share', false),
            ]);

            // Tạo thông báo
            Notification::create([
                'user_id' => $friendId,
                'type' => 'share',
                'title' => 'Chia sẻ mới',
                'message' => $user->name . ' đã chia sẻ ' . ($request->shareable_type === 'media' ? 'ảnh' : 'album') . ' với bạn',
                'data' => [
                    'share_id' => $share->id,
                    'shareable_type' => $request->shareable_type,
                    'shareable_id' => $request->shareable_id,
                ],
            ]);
        }

        $share->load('users');

        return response()->json([
            'message' => 'Đã chia sẻ với bạn bè',
            'share' => $share
        ]);
    }

    // Xem link chia sẻ công khai
    public function viewPublicShare($token)
    {
        $share = Share::where('token', $token)
            ->where('share_type', 'public_link')
            ->where(function($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->firstOrFail();

        // Load shareable with its relations
        $share->load('shareable');
        
        if ($share->shareable_type === 'album') {
            // For albums, load media files
            $share->shareable->load('mediaFiles');
        }

        // Tăng view count
        $share->increment('view_count');

        // Prepare share data without password hash (only indicate if password exists)
        $shareData = $share->toArray();
        $shareData['has_password'] = !empty($share->password);
        unset($shareData['password']); // Remove password hash from response

        return response()->json([
            'share' => $shareData,
            'shareable' => $share->shareable
        ]);
    }

    // Xác thực password cho link chia sẻ
    public function verifyPassword(Request $request, $token)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $share = Share::where('token', $token)->firstOrFail();

        if (!$share->password || !password_verify($request->password, $share->password)) {
            return response()->json(['message' => 'Mật khẩu không đúng'], 401);
        }

        return response()->json(['message' => 'Xác thực thành công']);
    }

    // Lấy danh sách các phần đã chia sẻ
    public function myShares(Request $request)
    {
        $user = Auth::user();
        $shareableType = $request->get('shareable_type');
        $shareableId = $request->get('shareable_id');
        
        $query = Share::where('shared_by', $user->id);
        
        if ($shareableType) {
            $query->where('shareable_type', $shareableType); // 'media' or 'album'
        }
        
        if ($shareableId) {
            $query->where('shareable_id', $shareableId);
        }
        
        $shares = $query->with(['shareable', 'users'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($shares);
    }

    // Lấy danh sách được chia sẻ với tôi
    public function sharedWithMe(Request $request)
    {
        $user = Auth::user();
        $shares = Share::whereHas('users', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['shareable', 'sharedBy'])
        ->orderBy('created_at', 'desc')
        ->paginate($request->get('per_page', 20));

        return response()->json($shares);
    }

    // Xóa chia sẻ
    public function destroy($id)
    {
        $user = Auth::user();
        $share = Share::where('shared_by', $user->id)->findOrFail($id);
        $share->delete();

        return response()->json(['message' => 'Đã xóa chia sẻ']);
    }

    // Cập nhật chia sẻ
    public function update(Request $request, $id)
    {
        $request->validate([
            'expires_at' => 'nullable|date',
            'password' => 'nullable|string|max:255',
            'allow_download' => 'boolean',
        ]);

        $user = Auth::user();
        $share = Share::where('shared_by', $user->id)->findOrFail($id);

        $updateData = [];
        if ($request->has('expires_at')) {
            $updateData['expires_at'] = $request->expires_at;
        }
        if ($request->has('password')) {
            $updateData['password'] = bcrypt($request->password);
        }
        if ($request->has('allow_download')) {
            $updateData['allow_download'] = $request->allow_download;
        }

        $share->update($updateData);

        return response()->json($share);
    }
}
