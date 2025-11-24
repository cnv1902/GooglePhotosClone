<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AlbumController extends Controller
{
    // Lấy danh sách album
    public function index(Request $request)
    {
        $user = Auth::user();
        $albums = Album::where('user_id', $user->id)
            ->with(['coverMedia', 'mediaFiles'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($albums);
    }

    // Tạo album mới
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_media_id' => 'nullable|exists:media_files,id',
            'media_ids' => 'nullable|array',
            'media_ids.*' => 'exists:media_files,id',
        ]);

        $user = Auth::user();
        $album = Album::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'cover_media_id' => $request->cover_media_id,
            'is_auto_created' => false,
        ]);

        // Thêm media vào album
        if ($request->has('media_ids')) {
            $mediaFiles = MediaFile::where('user_id', $user->id)
                ->whereIn('id', $request->media_ids)
                ->get();

            foreach ($mediaFiles as $mediaFile) {
                $album->mediaFiles()->attach($mediaFile->id, [
                    'added_by' => $user->id,
                    'added_at' => now(),
                ]);
            }
        }

        $album->load(['coverMedia', 'mediaFiles']);

        return response()->json($album, 201);
    }

    // Tạo album tự động từ metadata
    public function createAuto(Request $request)
    {
        $request->validate([
            'criteria' => 'required|array',
            'criteria.type' => 'required|in:date,location',
            'criteria.value' => 'required',
            'title' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $criteria = $request->criteria;

        $query = MediaFile::where('user_id', $user->id)
            ->where('is_trashed', false);

        if ($criteria['type'] === 'date') {
            $query->whereDate('taken_at', $criteria['value']);
        } elseif ($criteria['type'] === 'location') {
            $query->where('location_name', $criteria['value']);
        }

        $mediaFiles = $query->get();

        if ($mediaFiles->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy ảnh phù hợp'], 404);
        }

        $album = Album::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'description' => 'Album tự động tạo từ ' . $criteria['type'],
            'cover_media_id' => $mediaFiles->first()->id,
            'is_auto_created' => true,
            'auto_criteria' => $criteria,
        ]);

        foreach ($mediaFiles as $mediaFile) {
            $album->mediaFiles()->attach($mediaFile->id, [
                'added_by' => $user->id,
                'added_at' => now(),
            ]);
        }

        $album->load(['coverMedia', 'mediaFiles']);

        return response()->json($album, 201);
    }

    // Xem chi tiết album
    public function show($id)
    {
        $user = Auth::user();
        $album = Album::where('user_id', $user->id)
            ->with(['coverMedia', 'mediaFiles'])
            ->findOrFail($id);

        return response()->json($album);
    }

    // Cập nhật album
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'cover_media_id' => 'nullable|exists:media_files,id',
        ]);

        $user = Auth::user();
        $album = Album::where('user_id', $user->id)->findOrFail($id);

        $album->update($request->only(['title', 'description', 'cover_media_id']));
        $album->load(['coverMedia', 'mediaFiles']);

        return response()->json($album);
    }

    // Xóa album
    public function destroy($id)
    {
        $user = Auth::user();
        $album = Album::where('user_id', $user->id)->findOrFail($id);
        $album->delete();

        return response()->json(['message' => 'Đã xóa album']);
    }

    // Thêm media vào album
    public function addMedia(Request $request, $id)
    {
        $request->validate([
            'media_ids' => 'required|array',
            'media_ids.*' => 'exists:media_files,id',
        ]);

        $user = Auth::user();
        $album = Album::where('user_id', $user->id)->findOrFail($id);

        $mediaFiles = MediaFile::where('user_id', $user->id)
            ->whereIn('id', $request->media_ids)
            ->get();

        foreach ($mediaFiles as $mediaFile) {
            if (!$album->mediaFiles()->where('media_id', $mediaFile->id)->exists()) {
                $album->mediaFiles()->attach($mediaFile->id, [
                    'added_by' => $user->id,
                    'added_at' => now(),
                ]);
            }
        }

        $album->load(['coverMedia', 'mediaFiles']);

        return response()->json($album);
    }

    // Xóa media khỏi album
    public function removeMedia(Request $request, $id)
    {
        $request->validate([
            'media_ids' => 'required|array',
            'media_ids.*' => 'exists:media_files,id',
        ]);

        $user = Auth::user();
        $album = Album::where('user_id', $user->id)->findOrFail($id);

        $album->mediaFiles()->detach($request->media_ids);

        $album->load(['coverMedia', 'mediaFiles']);

        return response()->json($album);
    }
}
