<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'notice_id')) {
                $table->foreignId('notice_id')->nullable()->after('phone')
                    ->constrained('notices')->nullOnDelete();
            }
            if (!Schema::hasColumn('users', 'plan_id')) {
                $table->foreignId('plan_id')->nullable()->after('notice_id')
                    ->constrained('plans')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'plan_id')) {
                $table->dropConstrainedForeignId('plan_id');
            }
            if (Schema::hasColumn('users', 'notice_id')) {
                $table->dropConstrainedForeignId('notice_id');
            }
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
        });
    }
};
