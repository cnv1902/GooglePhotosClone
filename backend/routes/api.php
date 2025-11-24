<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\ShareController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::get('/shared/{token}', [ShareController::class, 'viewPublicShare']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/profile', [AuthController::class, 'updateProfile']);

    // Friends
    Route::prefix('friends')->group(function () {
        Route::get('/', [FriendController::class, 'index']);
        Route::get('/suggested', [FriendController::class, 'getSuggestedUsers']);
        Route::get('/pending-requests', [FriendController::class, 'getPendingRequests']);
        Route::post('/send-request', [FriendController::class, 'sendRequest']);
        Route::post('/accept-request', [FriendController::class, 'acceptRequest']);
        Route::post('/remove', [FriendController::class, 'removeFriend']);
        Route::post('/block', [FriendController::class, 'blockFriend']);
        Route::get('/search', [FriendController::class, 'searchUsers']);
    });

    // Media
    Route::prefix('media')->group(function () {
        Route::post('/upload', [MediaController::class, 'upload']);
        Route::get('/', [MediaController::class, 'index']);
        Route::get('/group-by-upload-date', [MediaController::class, 'groupByUploadDate']);
        Route::get('/group-by-taken-date', [MediaController::class, 'groupByTakenDate']);
        Route::get('/group-by-location', [MediaController::class, 'groupByLocation']);
        Route::get('/{id}', [MediaController::class, 'show']);
        Route::post('/delete', [MediaController::class, 'delete']);
        Route::post('/force-delete', [MediaController::class, 'forceDelete']);
        Route::post('/restore', [MediaController::class, 'restore']);
        Route::get('/trash/list', [MediaController::class, 'trash']);
        Route::post('/toggle-favorite', [MediaController::class, 'toggleFavorite']);
    });

    // Albums
    Route::prefix('albums')->group(function () {
        Route::get('/', [AlbumController::class, 'index']);
        Route::post('/', [AlbumController::class, 'store']);
        Route::post('/auto-create', [AlbumController::class, 'createAuto']);
        Route::get('/{id}', [AlbumController::class, 'show']);
        Route::put('/{id}', [AlbumController::class, 'update']);
        Route::delete('/{id}', [AlbumController::class, 'destroy']);
        Route::post('/{id}/add-media', [AlbumController::class, 'addMedia']);
        Route::post('/{id}/remove-media', [AlbumController::class, 'removeMedia']);
    });

    // Shares
    Route::prefix('shares')->group(function () {
        Route::post('/public-link', [ShareController::class, 'createPublicLink']);
        Route::post('/with-friends', [ShareController::class, 'shareWithFriends']);
        Route::post('/verify-password/{token}', [ShareController::class, 'verifyPassword']);
        Route::get('/my-shares', [ShareController::class, 'myShares']);
        Route::get('/shared-with-me', [ShareController::class, 'sharedWithMe']);
        Route::put('/{id}', [ShareController::class, 'update']);
        Route::delete('/{id}', [ShareController::class, 'destroy']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/mark-as-read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
    });
});
