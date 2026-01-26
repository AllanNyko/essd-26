<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('quizzes', 'subject_id')) {
            Schema::table('quizzes', function (Blueprint $table) {
                $table->unsignedBigInteger('subject_id')->after('id')->nullable();
            });
        }

        DB::table('quizzes')->whereNull('subject_id')->update(['subject_id' => 1]);

        try {
            Schema::table('quizzes', function (Blueprint $table) {
                $table->foreign('subject_id')->references('id')->on('subjects')->cascadeOnDelete();
            });
        } catch (\Throwable $e) {
            // Ignore if FK already exists
        }

        DB::statement('ALTER TABLE quizzes MODIFY subject_id BIGINT UNSIGNED NOT NULL');
    }

    public function down(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            $table->dropForeign(['subject_id']);
            $table->dropColumn('subject_id');
        });
    }
};
