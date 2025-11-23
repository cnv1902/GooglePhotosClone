<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

class UpdateUserStorageLimit extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:update-storage-limit';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update storage_limit for all users who don\'t have it set';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Kiểm tra xem column có tồn tại không
        if (!\Schema::hasColumn('users', 'storage_limit')) {
            $this->error('Column storage_limit does not exist. Please run migrations first:');
            $this->info('php artisan migrate');
            return Command::FAILURE;
        }
        
        $storageLimit = env('DEFAULT_STORAGE_LIMIT', 16106127360); // 15GB default
        
        try {
            $users = User::where(function($query) {
                $query->whereNull('storage_limit')
                      ->orWhere('storage_limit', 0);
            })->get();
            
            $count = 0;
            foreach ($users as $user) {
                $user->storage_limit = $storageLimit;
                $user->save();
                $count++;
            }
            
            $this->info("Updated storage_limit for {$count} users to " . number_format($storageLimit / 1024 / 1024 / 1024, 2) . " GB");
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
        
        return Command::SUCCESS;
    }
}
