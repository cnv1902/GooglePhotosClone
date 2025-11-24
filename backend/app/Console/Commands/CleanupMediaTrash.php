<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\MediaFile;

class CleanupMediaTrash extends Command
{
    protected $signature = 'media:cleanup-trash';
    protected $description = 'Xóa vĩnh viễn các media trong thùng rác quá hạn giữ';

    public function handle(): int
    {
        $days = (int)config('media.trash_retention_days', 30);
        $cutoff = now()->subDays($days);
        $trashed = MediaFile::where('is_trashed', true)
            ->where('trashed_at', '<', $cutoff)
            ->get();
        $count = 0;
        foreach ($trashed as $media) {
            try {
                \Storage::disk('public')->delete($media->file_path);
                if ($media->thumbnail_path) {
                    \Storage::disk('public')->delete($media->thumbnail_path);
                }
                $media->forceDelete();
                $count++;
            } catch (\Exception $e) {
                $this->error('Failed deleting media ID '.$media->id.': '.$e->getMessage());
            }
        }
        $this->info("Đã dọn dẹp {$count} media quá hạn trong thùng rác (>{$days} ngày)");
        return Command::SUCCESS;
    }
}
