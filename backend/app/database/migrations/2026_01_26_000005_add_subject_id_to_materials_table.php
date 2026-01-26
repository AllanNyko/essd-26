<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('materials', 'subject_id')) {
            Schema::table('materials', function (Blueprint $table) {
                $table->unsignedBigInteger('subject_id')->after('user_id')->nullable();
            });
        }

        DB::table('materials')->whereNull('subject_id')->update(['subject_id' => 1]);

        if (!Schema::hasColumn('materials', 'subject_id')) {
            return;
        }

        try {
            Schema::table('materials', function (Blueprint $table) {
                $table->foreign('subject_id')->references('id')->on('subjects')->cascadeOnDelete();
            });
        } catch (\Throwable $e) {
            // Ignore if FK already exists
        }

        DB::statement('ALTER TABLE materials MODIFY subject_id BIGINT UNSIGNED NOT NULL');

        if (Schema::hasColumn('materials', 'subject')) {
            DB::statement('ALTER TABLE materials DROP COLUMN subject');
        }
    }

    public function down(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->string('subject')->after('user_id');
            $table->dropForeign(['subject_id']);
            $table->dropColumn('subject_id');
        });
    }
};
