# Google Photos Clone - Ma Trận Tính Năng

## Tổng Quan Dự Án
Dự án clone Google Photos với đầy đủ tính năng quản lý ảnh/video, chia sẻ, và tương tác xã hội.

**Stack Công Nghệ:**
- Backend: Laravel 10 + Sanctum Authentication + MySQL
- Frontend: React 18 + Vite
- Processing: Intervention Image v3, FFmpeg
- Realtime: Laravel Echo + Pusher

---

## 1. Tài Khoản & Xác Thực

| Tính Năng | Trạng Thái | Backend | Frontend | Ghi Chú |
|-----------|------------|---------|----------|---------|
| Đăng ký tài khoản | ✅ Hoàn thành | `AuthController@register` | `Login.jsx` | Rate limit: 10/phút |
| Đăng nhập | ✅ Hoàn thành | `AuthController@login` | `Login.jsx` | Rate limit: 5/phút |
| Quên mật khẩu | ✅ Hoàn thành | `AuthController@forgotPassword` | - | Rate limit: 3/phút |
| Quản lý profile | ✅ Hoàn thành | `AuthController@profile, updateProfile` | `Profile.jsx` | Avatar upload |
| Sanctum session | ✅ Hoàn thành | Middleware `auth:sanctum` | API service | Token-based |

**Models:** `User`, `UserPreference`  
**Migrations:** `create_users_table`, `create_user_preferences_table`

---

## 2. Quản Lý Bạn Bè

| Tính Năng | Trạng Thái | Backend | Frontend | Ghi Chú |
|-----------|------------|---------|----------|---------|
| Gửi lời mời kết bạn | ✅ Hoàn thành | `FriendController@sendRequest` | `Friends.jsx` | Rate limit: 20/phút |
| Chấp nhận lời mời | ✅ Hoàn thành | `FriendController@acceptRequest` | `Friends.jsx` | Tạo notification |
| Từ chối/Xóa bạn | ✅ Hoàn thành | `FriendController@removeFriend` | `Friends.jsx` | Xóa friendship |
| Chặn người dùng | ✅ Hoàn thành | `FriendController@blockFriend` | `Friends.jsx` | Ngăn tương tác |
| Bỏ chặn | ✅ Hoàn thành | `FriendController@unblockFriend` | - | Xóa block record |
| Tìm kiếm người dùng | ✅ Hoàn thành | `FriendController@searchUsers` | `Friends.jsx` | Tìm theo name/email |
| Danh sách gợi ý | ✅ Hoàn thành | `FriendController@getSuggestedUsers` | `Friends.jsx` | Random users |
| Lời mời chờ duyệt | ✅ Hoàn thành | `FriendController@getPendingRequests` | `Friends.jsx` | Pending status |
| Realtime friend request | ✅ Hoàn thành | `FriendRequestSent` event | `realtime.js` | Private channel |

**Models:** `Friendship`  
**Migrations:** `create_friendships_table`  
**Events:** `FriendRequestSent`

---

## 3. Quản Lý Media (Ảnh/Video)

### 3.1 Upload & Metadata

| Tính Năng | Trạng Thái | Backend | Frontend | Ghi Chú |
|-----------|------------|---------|----------|---------|
| Upload nhiều file | ✅ Hoàn thành | `MediaController@upload` | `Photos.jsx` | Rate limit: 100/phút |
| Drag & Drop upload | ✅ Hoàn thành | - | `Photos.jsx` | HTML5 DnD API |
| Paste clipboard upload | ✅ Hoàn thành | - | `Photos.jsx` | Clipboard API |
| EXIF extraction | ✅ Hoàn thành | `MediaController@upload` | - | Intervention Image |
| GPS parsing | ✅ Hoàn thành | `MediaController@upload` | - | Lat/Lng extraction |
| Reverse geocoding | ✅ Hoàn thành | `ReverseGeocodeMedia` job | - | Nominatim API |
| Image thumbnail | ✅ Hoàn thành | `MediaController@upload` | - | Intervention fit |
| Video thumbnail | ✅ Hoàn thành | `MediaController@upload` | - | FFmpeg frame |
| Video metadata | ✅ Hoàn thành | `MediaController@upload` | - | Duration, resolution |
| Image compression | ✅ Hoàn thành | `MediaController@upload` | `Profile.jsx` | User preference quality |
| Storage quota check | ✅ Hoàn thành | `MediaController@upload` | - | User quota limit |
| Realtime upload event | ✅ Hoàn thành | `UploadCompleted` event | `realtime.js` | Private channel |

**Config:** `config/media.php` (compression, retention, ffmpeg path, reverse geocoding)

### 3.2 Xem & Tổ Chức

| Tính Năng | Trạng Thái | Backend | Frontend | Ghi Chú |
|-----------|------------|---------|----------|---------|
| Grid view responsive | ✅ Hoàn thành | - | `PhotoGrid.jsx` | Bootstrap grid |
| Lazy loading | ✅ Hoàn thành | - | `PhotoGrid.jsx` | HTML loading attr |
| Infinite scroll | ✅ Hoàn thành | - | `PhotoGrid.jsx` | Window scroll |
| Modal viewer | ✅ Hoàn thành | - | `PhotoModal.jsx` | Detail view |
| Group by upload date | ✅ Hoàn thành | `MediaController@groupByUploadDate` | - | SQL GROUP BY |
| Group by taken date | ✅ Hoàn thành | `MediaController@groupByTakenDate` | - | EXIF date |
| Group by location | ✅ Hoàn thành | `MediaController@groupByLocation` | - | GPS location |
| Favorites filter | ✅ Hoàn thành | `MediaController@index` | `Favorites.jsx` | `is_favorite` query |
| Toggle favorite | ✅ Hoàn thành | `MediaController@toggleFavorite` | `PhotoModal.jsx` | Boolean toggle |

### 3.3 Tagging

| Tính Năng | Trạng Thái | Backend | Frontend | Ghi Chú |
|-----------|------------|---------|----------|---------|
| Create tag | ✅ Hoàn thành | `TagController@store` | `PhotoModal.jsx` | Color support |
| List tags | ✅ Hoàn thành | `TagController@index` | `PhotoModal.jsx` | Search by keyword |
| Update tag | ✅ Hoàn thành | `TagController@update` | - | Name/color edit |
| Delete tag | ✅ Hoàn thành | `TagController@destroy` | - | Cascade detach |
| Add tags to media | ✅ Hoàn thành | `MediaController@addTags` | `PhotoModal.jsx` | Many-to-many |
| Remove tags from media | ✅ Hoàn thành | `MediaController@removeTags` | `PhotoModal.jsx` | Detach |
| Tag display UI | ✅ Hoàn thành | - | `PhotoModal.jsx` | Chroma.js colors |

**Models:** `Tag`, `MediaFile` (many-to-many)  
**Migrations:** `create_tags_table`, `create_media_tag_table`

### 3.4 Thùng Rác & Bulk Actions

| Tính Năng | Trạng Thái | Backend | Frontend | Ghi Chú |
|-----------|------------|---------|----------|---------|
| Soft delete | ✅ Hoàn thành | `MediaController@delete` | `PhotoGrid.jsx` | Rate limit: 100/phút |
| Permanent delete | ✅ Hoàn thành | `MediaController@forceDelete` | `Trash.jsx` | Rate limit: 50/phút |
| Restore media | ✅ Hoàn thành | `MediaController@restore` | `Trash.jsx` | Rate limit: 100/phút |
| View trash | ✅ Hoàn thành | `MediaController@trash` | `Trash.jsx` | Soft deleted items |
| Scheduled trash cleanup | ✅ Hoàn thành | `CleanupMediaTrash` command | - | Daily, retention days |
| Bulk selection | ✅ Hoàn thành | - | `PhotoGrid.jsx` | Checkbox mode |
| Bulk delete | ✅ Hoàn thành | - | `PhotoGrid.jsx`, `Trash.jsx` | Multi-ID delete |
| Bulk favorite | ✅ Hoàn thành | - | `PhotoGrid.jsx` | Multi-ID toggle |
| Bulk restore | ✅ Hoàn thành | - | `Trash.jsx` | Multi-ID restore |

**Commands:** `CleanupMediaTrash`  
**Schedule:** `app/Console/Kernel.php` (daily)

---

## 4. Albums

| Tính Năng | Trạng Thái | Backend | Frontend | Ghi Chú |
|-----------|------------|---------|----------|---------|
| Create album | ✅ Hoàn thành | `AlbumController@store` | `Albums.jsx` | Manual creation |
| Auto-create album | ✅ Hoàn thành | `AlbumController@createAuto` | - | Metadata-based |
| List albums | ✅ Hoàn thành | `AlbumController@index` | `Albums.jsx` | User albums |
| View album detail | ✅ Hoàn thành | `AlbumController@show` | `Albums.jsx` | Media list |
| Update album | ✅ Hoàn thành | `AlbumController@update` | - | Name/cover |
| Delete album | ✅ Hoàn thành | `AlbumController@destroy` | - | Keep media |
| Add media to album | ✅ Hoàn thành | `AlbumController@addMedia` | - | Attach |
| Remove media from album | ✅ Hoàn thành | `AlbumController@removeMedia` | - | Detach |

**Models:** `Album`  
**Migrations:** `create_albums_table`, `create_album_media_table`

---

## 5. Chia Sẻ

### 5.1 Public Shares

| Tính Năng | Trạng Thái | Backend | Frontend | Ghi Chú |
|-----------|------------|---------|----------|---------|
| Public link generation | ✅ Hoàn thành | `ShareController@createPublicLink` | `PhotoModal.jsx` | Rate limit: 30/phút |
| Token-based access | ✅ Hoàn thành | `ShareController@viewPublicShare` | - | Rate limit: 60/phút |
| Password protection | ✅ Hoàn thành | `ShareController@verifyPassword` | - | Enforced gating |
| Expiration date | ✅ Hoàn thành | `ShareController@viewPublicShare` | - | Auto-expire check |
| Scheduled cleanup | ✅ Hoàn thành | `CleanupExpiredShares` command | - | Hourly |

### 5.2 Friend Shares

| Tính Năng | Trạng Thái | Backend | Frontend | Ghi Chú |
|-----------|------------|---------|----------|---------|
| Share with friends | ✅ Hoàn thành | `ShareController@shareWithFriends` | `PhotoModal.jsx` | Rate limit: 30/phút |
| My shares list | ✅ Hoàn thành | `ShareController@myShares` | - | Created by user |
| Shared with me | ✅ Hoàn thành | `ShareController@sharedWithMe` | - | Received shares |
| Update share | ✅ Hoàn thành | `ShareController@update` | - | Edit settings |
| Delete share | ✅ Hoàn thành | `ShareController@destroy` | - | Revoke access |
| Realtime share event | ✅ Hoàn thành | `ShareCreated` event | `realtime.js` | Private channel |

**Models:** `Share`  
**Migrations:** `create_shares_table`  
**Events:** `ShareCreated`  
**Commands:** `CleanupExpiredShares`

---

## 6. Thông Báo

| Tính Năng | Trạng Thái | Backend | Frontend | Ghi Chú |
|-----------|------------|---------|----------|---------|
| Notification model | ✅ Hoàn thành | `Notification` model | - | Polymorphic data |
| List notifications | ✅ Hoàn thành | `NotificationController@index` | `Notifications.jsx` | User notifications |
| Mark as read | ✅ Hoàn thành | `NotificationController@markAsRead` | `Notifications.jsx` | Single notification |
| Mark all as read | ✅ Hoàn thành | `NotificationController@markAllAsRead` | `Notifications.jsx` | Batch update |
| Unread count | ✅ Hoàn thành | `NotificationController@unreadCount` | `Navbar.jsx` | Badge counter |
| Delete notification | ✅ Hoàn thành | `NotificationController@destroy` | - | Remove |
| Upload notification | ✅ Hoàn thành | `UploadCompleted` event | - | Auto-create |
| Share notification | ✅ Hoàn thành | `ShareCreated` event | - | Auto-create |
| Friend request notification | ✅ Hoàn thành | `FriendRequestSent` event | - | Auto-create |
| Realtime updates | ✅ Hoàn thành | Laravel Echo | `realtime.js` | Private channels |

**Models:** `Notification`  
**Migrations:** `create_notifications_table`  
**Service:** `frontend/src/services/realtime.js`

---

## 7. UI/UX

| Tính Năng | Trạng Thái | Component | Ghi Chú |
|-----------|------------|-----------|---------|
| Dark mode | ✅ Hoàn thành | `ThemeContext.jsx` | Toggle switch |
| Responsive grid | ✅ Hoàn thành | `PhotoGrid.jsx` | Bootstrap breakpoints |
| Navigation bar | ✅ Hoàn thành | `Navbar.jsx` | Route links |
| Photo modal | ✅ Hoàn thành | `PhotoModal.jsx` | Detail + actions |
| Upload progress | ✅ Hoàn thành | `Photos.jsx` | Progress feedback |
| Loading states | ✅ Hoàn thành | All components | Spinners |
| Error handling | ✅ Hoàn thành | All components | Alert messages |
| Bulk action UI | ✅ Hoàn thành | `PhotoGrid.jsx` | Checkbox + buttons |
| Favorites view | ✅ Hoàn thành | `Favorites.jsx` | Dedicated page |
| Trash view | ✅ Hoàn thành | `Trash.jsx` | Soft deleted items |

**Context:** `ThemeContext`  
**Components:** `Navbar`, `PhotoGrid`, `PhotoModal`, `Photos`, `Favorites`, `Trash`, `Notifications`, `Friends`, `Albums`, `Profile`

---

## 8. Hiệu Năng & Bảo Trì

### 8.1 Optimization

| Tính Năng | Trạng Thái | Implementation | Ghi Chú |
|-----------|------------|----------------|---------|
| Image compression | ✅ Hoàn thành | Intervention Image | User preference quality |
| Thumbnail generation | ✅ Hoàn thành | Intervention + FFmpeg | Image + video |
| Lazy loading | ✅ Hoàn thành | HTML loading attr | Images |
| Infinite scroll | ✅ Hoàn thành | Window scroll listener | Pagination |
| Background jobs | ✅ Hoàn thành | Laravel Queue | Reverse geocode |
| Storage quota | ✅ Hoàn thành | User storage limit | Enforced |

### 8.2 Security & Rate Limiting

| Endpoint | Rate Limit | Ghi Chú |
|----------|-----------|---------|
| `/register` | 10/phút | Anti-spam |
| `/login` | 5/phút | Brute-force protection |
| `/forgot-password` | 3/phút | Email flood prevention |
| `/media/upload` | 100/phút | Upload throttle |
| `/media/delete` | 100/phút | Delete throttle |
| `/media/force-delete` | 50/phút | Permanent delete |
| `/friends/send-request` | 20/phút | Friend spam prevention |
| `/shares/public-link` | 30/phút | Share creation limit |
| `/shares/with-friends` | 30/phút | Share creation limit |

### 8.3 Scheduled Tasks

| Command | Schedule | Mục Đích |
|---------|----------|----------|
| `CleanupMediaTrash` | Daily | Xóa media quá hạn trong trash |
| `CleanupExpiredShares` | Hourly | Xóa share links hết hạn |

**Schedule:** `app/Console/Kernel.php`  
**Config:** `config/media.php` (retention days)

---

## 9. Realtime Features

| Event | Channel | Payload | Frontend Handler |
|-------|---------|---------|------------------|
| `UploadCompleted` | `private-App.Models.User.{id}` | MediaFile data | `realtime.js` |
| `ShareCreated` | `private-App.Models.User.{id}` | Share data | `realtime.js` |
| `FriendRequestSent` | `private-App.Models.User.{id}` | Friendship data | `realtime.js` |

**Broadcasting:** Laravel Echo + Pusher  
**Events:** `app/Events/`  
**Frontend:** `src/services/realtime.js`

---

## 10. Cấu Hình

### Backend Config Files

- `config/media.php`: Compression quality, retention days, reverse geocoding, FFmpeg path
- `config/filesystems.php`: Storage disk configuration
- `config/broadcasting.php`: Pusher credentials
- `.env`: Database, Redis, Pusher, API keys

### Frontend Config

- `src/utils/config.js`: API base URL, storage base URL
- `vite.config.js`: Build configuration
- `.env`: API endpoints

---

## Tổng Kết

### ✅ Hoàn Thành (100%)

- **Tài khoản:** Đăng ký, đăng nhập, quên mật khẩu, profile
- **Bạn bè:** Kết bạn, chặn/bỏ chặn, tìm kiếm, gợi ý
- **Media:** Upload (drag-drop, paste), EXIF, GPS, reverse geocode, thumbnail (ảnh + video), metadata video, compression
- **Tagging:** CRUD tags, assign/remove tags, color support
- **Albums:** Create, auto-create, manage media
- **Chia sẻ:** Public links, password protection, expiration, friend shares
- **Thông báo:** Database + realtime notifications
- **Thùng rác:** Soft delete, restore, permanent delete, scheduled cleanup
- **Bulk actions:** Select, delete, favorite, restore (Photos, Favorites, Trash)
- **UI/UX:** Dark mode, responsive, modal, lazy load, infinite scroll
- **Realtime:** Upload, share, friend request events
- **Security:** Rate limiting cho tất cả endpoints nhạy cảm
- **Maintenance:** Scheduled cleanup tasks

### 🎯 Coverage: 100%

Tất cả các yêu cầu chức năng đã được triển khai đầy đủ với quality production-ready.

---

## Hướng Dẫn Sử Dụng

### Setup Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan queue:work  # For background jobs
php artisan serve
```

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Dependencies
- PHP 8.1+
- Composer
- MySQL 8.0+
- Node.js 18+
- FFmpeg (for video processing)

---

*Tài liệu được tạo tự động từ kiểm toán code*  
*Cập nhật lần cuối: November 24, 2025*
