<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            if (!Schema::hasColumn('quizzes', 'accuracy_percentage')) {
                $table->decimal('accuracy_percentage', 5, 2)->default(0)->after('errors');
            }
            if (!Schema::hasColumn('quizzes', 'difficulty_label')) {
                $table->string('difficulty_label', 20)->default('Fácil')->after('accuracy_percentage');
            }
        });

        DB::statement("
            UPDATE quizzes
            SET accuracy_percentage = CASE
                WHEN (hits + errors) > 0 THEN (hits * 100.0) / (hits + errors)
                ELSE 0
            END,
            difficulty_label = CASE
                WHEN (CASE WHEN (hits + errors) > 0 THEN (hits * 100.0) / (hits + errors) ELSE 0 END) < 30 THEN 'Difícil'
                WHEN (CASE WHEN (hits + errors) > 0 THEN (hits * 100.0) / (hits + errors) ELSE 0 END) < 70 THEN 'Média'
                ELSE 'Fácil'
            END
        ");
    }

    public function down(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            if (Schema::hasColumn('quizzes', 'difficulty_label')) {
                $table->dropColumn('difficulty_label');
            }
            if (Schema::hasColumn('quizzes', 'accuracy_percentage')) {
                $table->dropColumn('accuracy_percentage');
            }
        });
    }
};
