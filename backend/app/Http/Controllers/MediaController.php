<?php

namespace App\Http\Controllers;

use App\Models\MediaFile;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    // Upload ảnh/video đơn lẻ hoặc nhiều file
    public function upload(Request $request)
    {
        $user = Auth::user();
        
        // Refresh user từ database để đảm bảo có dữ liệu mới nhất
        $user->refresh();
        
        // Đảm bảo user có storage_limit
        if (!$user->storage_limit || $user->storage_limit == 0) {
            $storageLimit = env('DEFAULT_STORAGE_LIMIT', 16106127360); // 15GB default
            $user->storage_limit = $storageLimit;
            $user->save();
        }
        
        $uploadedFiles = [];
        
        // Lấy files từ request
        // Laravel tự động parse files[0], files[1]... thành array trong $request->file('files')
        $files = $request->file('files');
        
        // Debug: Log để kiểm tra (chỉ trong development)
        if (config('app.debug')) {
            Log::info('Upload request', [
                'user_id' => $user->id,
                'storage_used' => $user->storage_used,
                'storage_limit' => $user->storage_limit,
                'available_space' => $user->storage_limit - $user->storage_used,
                'has_files' => $request->hasFile('files'),
                'files_count' => $files ? (is_array($files) ? count($files) : 1) : 0,
                'all_files_keys' => array_keys($request->allFiles()),
                'content_type' => $request->header('Content-Type'),
            ]);
        }
        
        // Kiểm tra nếu không có files
        if (!$request->hasFile('files')) {
            // Thử kiểm tra xem có file nào trong request không
            $allFiles = $request->allFiles();
            if (empty($allFiles)) {
                return response()->json([
                    'message' => 'Không có file nào được upload. Vui lòng chọn file để upload.',
                    'debug' => config('app.debug') ? [
                        'has_files' => $request->hasFile('files'),
                        'all_files_keys' => array_keys($request->allFiles()),
                        'request_keys' => array_keys($request->all())
                    ] : null
                ], 400);
            }
            // Nếu có files trong allFiles nhưng không phải key 'files', lấy file đầu tiên
            $files = reset($allFiles);
        }
        
        // Đảm bảo files là array
        if (!is_array($files)) {
            $files = [$files];
        }
        
        // Kiểm tra files có rỗng không
        if (empty($files) || count($files) === 0) {
            return response()->json([
                'message' => 'Không có file nào được upload. Vui lòng chọn file để upload.'
            ], 400);
        }
        
        // Validate từng file
        foreach ($files as $file) {
            if (!$file || !$file->isValid()) {
                return response()->json([
                    'message' => 'File không hợp lệ'
                ], 400);
            }
            
            $mimeType = $file->getMimeType();
            $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 
                           'video/mp4', 'video/avi', 'video/quicktime', 'video/webm'];
            
            if (!in_array($mimeType, $allowedMimes)) {
                return response()->json([
                    'message' => 'Loại file không được hỗ trợ: ' . $mimeType
                ], 400);
            }
            
            if ($file->getSize() > 102400 * 1024) { // 100MB
                return response()->json([
                    'message' => 'File quá lớn. Kích thước tối đa là 100MB'
                ], 400);
            }
        }

        foreach ($files as $file) {
            // Kiểm tra dung lượng
            $fileSize = $file->getSize();
            
            // Refresh user để đảm bảo có giá trị mới nhất
            $user->refresh();
            
            $availableSpace = $user->storage_limit - $user->storage_used;
            
            if (config('app.debug')) {
                Log::info('Checking storage for file', [
                    'file_size' => $fileSize,
                    'file_size_mb' => number_format($fileSize / 1024 / 1024, 2),
                    'storage_used' => $user->storage_used,
                    'storage_limit' => $user->storage_limit,
                    'available_space' => $availableSpace,
                    'available_space_mb' => number_format($availableSpace / 1024 / 1024, 2),
                ]);
            }
            
            if ($fileSize > $availableSpace) {
                $usedGB = number_format($user->storage_used / 1024 / 1024 / 1024, 2);
                $limitGB = number_format($user->storage_limit / 1024 / 1024 / 1024, 2);
                $fileMB = number_format($fileSize / 1024 / 1024, 2);
                $availableMB = number_format($availableSpace / 1024 / 1024, 2);
                
                return response()->json([
                    'message' => "Không đủ dung lượng lưu trữ. File cần {$fileMB} MB nhưng chỉ còn {$availableMB} MB trống. (Đã dùng: {$usedGB} GB / {$limitGB} GB)",
                    'debug' => config('app.debug') ? [
                        'file_size' => $fileSize,
                        'storage_used' => $user->storage_used,
                        'storage_limit' => $user->storage_limit,
                    ] : null
                ], 400);
            }

            $mimeType = $file->getMimeType();
            $fileType = $this->getFileType($mimeType);
            $originalName = $file->getClientOriginalName();
            $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
            
            // Lưu file gốc
            $filePath = $file->storeAs('media/' . $user->id, $fileName, 'public');
            $fullPath = storage_path('app/public/' . $filePath);

            $metadata = [];
            $thumbnailPath = null;

            if (in_array($fileType, ['image', 'gif'])) {
                // Xử lý ảnh với Intervention Image v3
                try {
                    $manager = new ImageManager(new Driver());
                    $image = $manager->read($fullPath);
                    $width = $image->width();
                    $height = $image->height();

                    // Tối ưu ảnh trước khi lưu (giữ nguyên format)
                    $image->save($fullPath);

                    // Tạo thumbnail
                    $thumbnail = $image->scale(width: 300, height: 300);
                    $thumbnailFileName = 'thumb_' . $fileName;
                    $thumbnailPath = 'media/' . $user->id . '/thumbnails/' . $thumbnailFileName;
                    $thumbnailDir = storage_path('app/public/media/' . $user->id . '/thumbnails');
                    if (!file_exists($thumbnailDir)) {
                        mkdir($thumbnailDir, 0755, true);
                    }
                    $thumbnail->save(storage_path('app/public/' . $thumbnailPath));

                    // Trích xuất EXIF metadata
                    $metadata = $this->extractExifData($fullPath);
                } catch (\Exception $e) {
                    // Nếu không xử lý được ảnh, vẫn lưu file gốc
                    Log::error('Image processing error: ' . $e->getMessage());
                    $width = null;
                    $height = null;
                }
            } elseif ($fileType === 'video') {
                // Xử lý video - lấy thông tin cơ bản
                $width = null;
                $height = null;
                $duration = null;
                // Note: Cần ffmpeg để lấy thông tin video chi tiết
            }

            // Tạo media file record
            $mediaFile = MediaFile::create([
                'user_id' => $user->id,
                'original_name' => $originalName,
                'file_name' => $fileName,
                'file_path' => $filePath,
                'thumbnail_path' => $thumbnailPath,
                'file_size' => $fileSize,
                'mime_type' => $mimeType,
                'file_type' => $fileType,
                'width' => $width ?? null,
                'height' => $height ?? null,
                'duration' => $duration ?? null,
                'camera_make' => $metadata['camera_make'] ?? null,
                'camera_model' => $metadata['camera_model'] ?? null,
                'exposure_time' => $metadata['exposure_time'] ?? null,
                'aperture' => $metadata['aperture'] ?? null,
                'iso' => $metadata['iso'] ?? null,
                'focal_length' => $metadata['focal_length'] ?? null,
                'taken_at' => $metadata['taken_at'] ?? null,
                'latitude' => $metadata['latitude'] ?? null,
                'longitude' => $metadata['longitude'] ?? null,
                'location_name' => $metadata['location_name'] ?? null,
            ]);

            // Cập nhật dung lượng đã sử dụng
            $user->storage_used += $fileSize;
            $user->save();

            // Tạo thông báo
            Notification::create([
                'user_id' => $user->id,
                'type' => 'upload_complete',
                'title' => 'Upload thành công',
                'message' => 'Ảnh ' . $originalName . ' đã được upload thành công',
                'data' => ['media_id' => $mediaFile->id],
            ]);

            $uploadedFiles[] = $mediaFile;
        }

        return response()->json([
            'message' => 'Upload thành công',
            'files' => $uploadedFiles
        ]);
    }

    // Lấy danh sách ảnh với phân trang, sắp xếp, lọc
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = MediaFile::where('user_id', $user->id)
            ->where('is_trashed', false);

        // Lọc theo loại
        if ($request->has('file_type')) {
            $query->where('file_type', $request->file_type);
        }

        // Lọc theo ngày upload
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Lọc theo ngày chụp
        if ($request->has('taken_date')) {
            $query->whereDate('taken_at', $request->taken_date);
        }

        // Lọc theo địa điểm
        if ($request->has('location')) {
            $query->whereNotNull('latitude')
                  ->whereNotNull('longitude');
        }

        // Sắp xếp
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Phân trang
        $perPage = $request->get('per_page', 50);
        $mediaFiles = $query->paginate($perPage);

        return response()->json($mediaFiles);
    }

    // Nhóm ảnh theo ngày upload
    public function groupByUploadDate(Request $request)
    {
        $user = Auth::user();
        $mediaFiles = MediaFile::where('user_id', $user->id)
            ->where('is_trashed', false)
            ->orderBy('created_at', 'desc')
            ->get();

        $grouped = $mediaFiles->groupBy(function($item) {
            return $item->created_at->format('Y-m-d');
        });

        $result = $grouped->map(function($items, $date) {
            return [
                'date' => $date,
                'count' => $items->count(),
                'files' => $items->values()
            ];
        })->values();

        return response()->json($result);
    }

    // Nhóm ảnh theo ngày chụp
    public function groupByTakenDate(Request $request)
    {
        $user = Auth::user();
        $mediaFiles = MediaFile::where('user_id', $user->id)
            ->where('is_trashed', false)
            ->whereNotNull('taken_at')
            ->orderBy('taken_at', 'desc')
            ->get();

        $grouped = $mediaFiles->groupBy(function($item) {
            return $item->taken_at->format('Y-m-d');
        });

        $result = $grouped->map(function($items, $date) {
            return [
                'date' => $date,
                'count' => $items->count(),
                'files' => $items->values()
            ];
        })->values();

        return response()->json($result);
    }

    // Nhóm ảnh theo địa điểm
    public function groupByLocation(Request $request)
    {
        $user = Auth::user();
        $mediaFiles = MediaFile::where('user_id', $user->id)
            ->where('is_trashed', false)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get();

        $grouped = $mediaFiles->groupBy(function($item) {
            return $item->location_name ?? ($item->latitude . ',' . $item->longitude);
        });

        $result = $grouped->map(function($items, $location) {
            return [
                'location' => $location,
                'count' => $items->count(),
                'files' => $items->values()
            ];
        })->values();

        return response()->json($result);
    }

    // Xem chi tiết ảnh
    public function show($id)
    {
        $user = Auth::user();
        $mediaFile = MediaFile::where('user_id', $user->id)
            ->where('is_trashed', false)
            ->findOrFail($id);

        return response()->json($mediaFile);
    }

    // Xóa ảnh (chuyển vào thùng rác)
    public function delete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:media_files,id',
        ]);

        $user = Auth::user();
        $mediaFiles = MediaFile::where('user_id', $user->id)
            ->whereIn('id', $request->ids)
            ->get();

        foreach ($mediaFiles as $mediaFile) {
            $mediaFile->is_trashed = true;
            $mediaFile->trashed_at = now();
            $mediaFile->save();
        }

        return response()->json(['message' => 'Đã chuyển vào thùng rác']);
    }

    // Xóa vĩnh viễn
    public function forceDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:media_files,id',
        ]);

        $user = Auth::user();
        $mediaFiles = MediaFile::where('user_id', $user->id)
            ->whereIn('id', $request->ids)
            ->get();

        foreach ($mediaFiles as $mediaFile) {
            // Xóa file vật lý
            Storage::disk('public')->delete($mediaFile->file_path);
            if ($mediaFile->thumbnail_path) {
                Storage::disk('public')->delete($mediaFile->thumbnail_path);
            }

            // Cập nhật dung lượng
            $user->storage_used -= $mediaFile->file_size;
            $user->save();

            // Xóa record
            $mediaFile->forceDelete();
        }

        return response()->json(['message' => 'Đã xóa vĩnh viễn']);
    }

    // Khôi phục từ thùng rác
    public function restore(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:media_files,id',
        ]);

        $user = Auth::user();
        $mediaFiles = MediaFile::where('user_id', $user->id)
            ->whereIn('id', $request->ids)
            ->get();

        foreach ($mediaFiles as $mediaFile) {
            $mediaFile->is_trashed = false;
            $mediaFile->trashed_at = null;
            $mediaFile->save();
        }

        return response()->json(['message' => 'Đã khôi phục']);
    }

    // Lấy danh sách trong thùng rác
    public function trash(Request $request)
    {
        $user = Auth::user();
        $query = MediaFile::where('user_id', $user->id)
            ->where('is_trashed', true);

        $perPage = $request->get('per_page', 50);
        $mediaFiles = $query->orderBy('trashed_at', 'desc')->paginate($perPage);

        return response()->json($mediaFiles);
    }

    // Đánh dấu yêu thích
    public function toggleFavorite(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:media_files,id',
        ]);

        $user = Auth::user();
        $mediaFile = MediaFile::where('user_id', $user->id)
            ->findOrFail($request->id);

        $mediaFile->is_favorite = !$mediaFile->is_favorite;
        $mediaFile->save();

        return response()->json([
            'message' => $mediaFile->is_favorite ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích',
            'is_favorite' => $mediaFile->is_favorite
        ]);
    }

    // Helper methods
    private function getFileType($mimeType)
    {
        if (str_starts_with($mimeType, 'image/')) {
            return $mimeType === 'image/gif' ? 'gif' : 'image';
        } elseif (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }
        return 'image';
    }

    private function extractExifData($filePath)
    {
        $metadata = [];
        
        if (!function_exists('exif_read_data')) {
            return $metadata;
        }

        try {
            $exif = @exif_read_data($filePath);
            if (!$exif) {
                return $metadata;
            }

            // Camera info
            $metadata['camera_make'] = $exif['Make'] ?? null;
            $metadata['camera_model'] = $exif['Model'] ?? null;

            // Exposure settings
            if (isset($exif['ExposureTime'])) {
                $metadata['exposure_time'] = $exif['ExposureTime'] . 's';
            }
            if (isset($exif['FNumber'])) {
                $metadata['aperture'] = 'f/' . $exif['FNumber'];
            }
            $metadata['iso'] = $exif['ISOSpeedRatings'] ?? null;
            if (isset($exif['FocalLength'])) {
                $metadata['focal_length'] = $exif['FocalLength'] . 'mm';
            }

            // Date taken
            if (isset($exif['DateTimeOriginal'])) {
                $metadata['taken_at'] = date('Y-m-d H:i:s', strtotime($exif['DateTimeOriginal']));
            } elseif (isset($exif['DateTime'])) {
                $metadata['taken_at'] = date('Y-m-d H:i:s', strtotime($exif['DateTime']));
            }

            // GPS coordinates
            if (isset($exif['GPS'])) {
                $lat = $this->getGpsCoordinate($exif['GPS']['GPSLatitude'], $exif['GPS']['GPSLatitudeRef']);
                $lon = $this->getGpsCoordinate($exif['GPS']['GPSLongitude'], $exif['GPS']['GPSLongitudeRef']);
                $metadata['latitude'] = $lat;
                $metadata['longitude'] = $lon;
            }
        } catch (\Exception $e) {
            // Ignore EXIF errors
        }

        return $metadata;
    }

    private function getGpsCoordinate($coordinate, $hemisphere)
    {
        if (empty($coordinate)) {
            return null;
        }

        $degrees = count($coordinate) > 0 ? $this->gpsToDecimal($coordinate[0]) : 0;
        $minutes = count($coordinate) > 1 ? $this->gpsToDecimal($coordinate[1]) : 0;
        $seconds = count($coordinate) > 2 ? $this->gpsToDecimal($coordinate[2]) : 0;

        $flip = ($hemisphere == 'W' || $hemisphere == 'S') ? -1 : 1;
        return $flip * ($degrees + $minutes / 60 + $seconds / 3600);
    }

    private function gpsToDecimal($coordinate)
    {
        if (is_array($coordinate)) {
            return floatval($coordinate[0]) / floatval($coordinate[1]);
        }
        return floatval($coordinate);
    }
}
