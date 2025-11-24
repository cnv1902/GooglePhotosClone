<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\ShareController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TagController;

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
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:3,1');
Route::get('/shared/{token}', [ShareController::class, 'viewPublicShare'])->middleware('throttle:60,1');
Route::post('/shares/verify-password/{token}', [ShareController::class, 'verifyPassword'])->middleware('throttle:10,1');

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
        Route::post('/send-request', [FriendController::class, 'sendRequest'])->middleware('throttle:20,1');
        Route::post('/accept-request', [FriendController::class, 'acceptRequest']);
        Route::post('/remove', [FriendController::class, 'removeFriend']);
        Route::post('/block', [FriendController::class, 'blockFriend']);
        Route::post('/unblock', [FriendController::class, 'unblockFriend']);
        Route::get('/search', [FriendController::class, 'searchUsers']);
    });

    // Media
    Route::prefix('media')->group(function () {
        Route::post('/upload', [MediaController::class, 'upload'])->middleware('throttle:100,1');
        Route::get('/', [MediaController::class, 'index']);
        Route::get('/group-by-upload-date', [MediaController::class, 'groupByUploadDate']);
        Route::get('/group-by-taken-date', [MediaController::class, 'groupByTakenDate']);
        Route::get('/group-by-location', [MediaController::class, 'groupByLocation']);
        Route::get('/{id}', [MediaController::class, 'show']);
        Route::post('/delete', [MediaController::class, 'delete'])->middleware('throttle:100,1');
        Route::post('/force-delete', [MediaController::class, 'forceDelete'])->middleware('throttle:50,1');
        Route::post('/restore', [MediaController::class, 'restore'])->middleware('throttle:100,1');
        Route::get('/trash/list', [MediaController::class, 'trash']);
        Route::post('/toggle-favorite', [MediaController::class, 'toggleFavorite']);
        Route::post('/add-tags', [MediaController::class, 'addTags']);
        Route::post('/remove-tags', [MediaController::class, 'removeTags']);
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
        Route::post('/public-link', [ShareController::class, 'createPublicLink'])->middleware('throttle:30,1');
        Route::post('/with-friends', [ShareController::class, 'shareWithFriends'])->middleware('throttle:30,1');
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

    // Tags
    Route::prefix('tags')->group(function () {
        Route::get('/', [TagController::class, 'index']);
        Route::post('/', [TagController::class, 'store']);
        Route::put('/{id}', [TagController::class, 'update']);
        Route::delete('/{id}', [TagController::class, 'destroy']);
    });
});
