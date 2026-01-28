<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasColumn('users', 'avatar_url')) {
            DB::statement('ALTER TABLE `users` MODIFY `avatar_url` LONGTEXT NULL');
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'avatar_url')) {
            DB::statement('ALTER TABLE `users` MODIFY `avatar_url` TEXT NULL');
        }
    }
};
