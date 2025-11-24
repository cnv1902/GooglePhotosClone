<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // Đăng ký
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);
        $storageLimit = env('DEFAULT_STORAGE_LIMIT', 16106127360); // 15GB default
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'storage_limit' => $storageLimit,
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token]);
    }

    // Đăng nhập
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Sai thông tin đăng nhập'], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token]);
    }

    // Quên mật khẩu
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));
        return response()->json(['status' => $status]);
    }

    // Hồ sơ cá nhân
    public function profile(Request $request)
    {
        $user = $request->user();
        
        // Đảm bảo user có storage_limit
        if (!$user->storage_limit || $user->storage_limit == 0) {
            $storageLimit = env('DEFAULT_STORAGE_LIMIT', 16106127360); // 15GB default
            $user->storage_limit = $storageLimit;
            $user->save();
        }
        
        return response()->json($user);
    }

    // Cập nhật hồ sơ cá nhân (ảnh, tên)
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        if (config('app.debug')) {
            Log::info('Update profile request', [
                'user_id' => $user->id,
                'has_name' => $request->has('name'),
                'has_avatar' => $request->hasFile('avatar'),
                'has_date_of_birth' => $request->has('date_of_birth'),
                'has_gender' => $request->has('gender'),
                'has_bio' => $request->has('bio'),
                'all_request_data' => $request->all(),
            ]);
        }
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'avatar' => 'nullable|image|max:2048',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'bio' => 'nullable|string|max:1000',
        ]);
        
        if ($request->hasFile('avatar')) {
            // Xóa avatar cũ nếu có
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }
        
        // Cập nhật các trường
        if ($request->has('name')) {
            $user->name = $request->input('name');
        }
        
        // Xử lý date_of_birth
        if ($request->has('date_of_birth')) {
            $dateOfBirth = $request->input('date_of_birth');
            $user->date_of_birth = $dateOfBirth && $dateOfBirth !== '' ? $dateOfBirth : null;
        }
        
        // Xử lý gender
        if ($request->has('gender')) {
            $gender = $request->input('gender');
            $user->gender = $gender && $gender !== '' ? $gender : null;
        }
        
        // Xử lý bio
        if ($request->has('bio')) {
            $bio = $request->input('bio');
            $user->bio = $bio && $bio !== '' ? $bio : null;
        }
        
        $user->save();
        
        // Refresh để lấy dữ liệu mới nhất
        $user->refresh();
        
        if (config('app.debug')) {
            Log::info('Profile updated', [
                'user_id' => $user->id,
                'name' => $user->name,
                'date_of_birth' => $user->date_of_birth,
                'gender' => $user->gender,
                'bio' => $user->bio,
            ]);
        }
        
        return response()->json($user);
    }
}
