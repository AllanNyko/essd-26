<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            if (!Schema::hasColumn('quizzes', 'hits')) {
                $table->unsignedInteger('hits')->default(0)->after('validations_count');
            }
            if (!Schema::hasColumn('quizzes', 'errors')) {
                $table->unsignedInteger('errors')->default(0)->after('hits');
            }
            if (Schema::hasColumn('quizzes', 'difficulty')) {
                $table->dropColumn('difficulty');
            }
        });
    }

    public function down(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            if (!Schema::hasColumn('quizzes', 'difficulty')) {
                $table->unsignedTinyInteger('difficulty')->default(0)->after('validations_count');
            }
            if (Schema::hasColumn('quizzes', 'hits')) {
                $table->dropColumn('hits');
            }
            if (Schema::hasColumn('quizzes', 'errors')) {
                $table->dropColumn('errors');
            }
        });
    }
};
