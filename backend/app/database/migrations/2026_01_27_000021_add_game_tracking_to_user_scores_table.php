<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('user_scores', function (Blueprint $table) {
            if (!Schema::hasColumn('user_scores', 'individual_hits')) {
                $table->unsignedInteger('individual_hits')->default(0)->after('contribution_points');
            }
            if (!Schema::hasColumn('user_scores', 'individual_errors')) {
                $table->unsignedInteger('individual_errors')->default(0)->after('individual_hits');
            }
            if (!Schema::hasColumn('user_scores', 'survivor_hits')) {
                $table->unsignedInteger('survivor_hits')->default(0)->after('individual_errors');
            }
            if (!Schema::hasColumn('user_scores', 'survivor_errors')) {
                $table->unsignedInteger('survivor_errors')->default(0)->after('survivor_hits');
            }
            if (!Schema::hasColumn('user_scores', 'individual_points')) {
                $table->unsignedInteger('individual_points')->default(0)->after('survivor_errors');
            }
            if (!Schema::hasColumn('user_scores', 'survivor_points')) {
                $table->unsignedInteger('survivor_points')->default(0)->after('individual_points');
            }
        });
    }

    public function down(): void
    {
        Schema::table('user_scores', function (Blueprint $table) {
            if (Schema::hasColumn('user_scores', 'survivor_points')) {
                $table->dropColumn('survivor_points');
            }
            if (Schema::hasColumn('user_scores', 'individual_points')) {
                $table->dropColumn('individual_points');
            }
            if (Schema::hasColumn('user_scores', 'survivor_errors')) {
                $table->dropColumn('survivor_errors');
            }
            if (Schema::hasColumn('user_scores', 'survivor_hits')) {
                $table->dropColumn('survivor_hits');
            }
            if (Schema::hasColumn('user_scores', 'individual_errors')) {
                $table->dropColumn('individual_errors');
            }
            if (Schema::hasColumn('user_scores', 'individual_hits')) {
                $table->dropColumn('individual_hits');
            }
        });
    }
};
