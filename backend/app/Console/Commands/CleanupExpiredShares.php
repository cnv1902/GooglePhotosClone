<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Share;

class CleanupExpiredShares extends Command
{
    protected $signature = 'shares:cleanup-expired';
    protected $description = 'Xóa các chia sẻ đã hết hạn';

    public function handle(): int
    {
        $expired = Share::whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->get();
        $count = 0;
        foreach ($expired as $share) {
            try {
                $share->delete();
                $count++;
            } catch (\Exception $e) {
                $this->error('Failed deleting share ID '.$share->id.': '.$e->getMessage());
            }
        }
        $this->info("Đã xóa {$count} chia sẻ hết hạn");
        return Command::SUCCESS;
    }
}
