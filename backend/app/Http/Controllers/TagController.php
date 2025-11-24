<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TagController extends Controller
{
    // Danh sách tags (có thể lọc theo keyword)
    public function index(Request $request)
    {
        $query = Tag::query();
        if ($request->has('q') && $request->q !== '') {
            $kw = trim($request->q);
            $query->where('name', 'like', "%{$kw}%");
        }
        $tags = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 50));
        return response()->json($tags);
    }

    // Tạo mới tag
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:tags,name',
            'color' => 'nullable|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);
        $user = Auth::user();
        $tag = Tag::create([
            'name' => $request->name,
            'color' => $request->color ?? '#3B82F6',
            'created_by' => $user->id,
        ]);
        return response()->json($tag, 201);
    }

    // Cập nhật tag
    public function update(Request $request, $id)
    {
        $tag = Tag::findOrFail($id);
        $request->validate([
            'name' => 'sometimes|string|max:100|unique:tags,name,' . $tag->id,
            'color' => 'nullable|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);
        $update = [];
        if ($request->has('name')) $update['name'] = $request->name;
        if ($request->has('color')) $update['color'] = $request->color;
        if (!empty($update)) {
            $tag->update($update);
        }
        return response()->json($tag);
    }

    // Xóa tag
    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();
        return response()->json(['message' => 'Đã xóa tag']);
    }
}
