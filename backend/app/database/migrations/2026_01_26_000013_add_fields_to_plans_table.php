<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            if (!Schema::hasColumn('plans', 'price')) {
                $table->decimal('price', 10, 2)->nullable()->after('name');
            }
            if (!Schema::hasColumn('plans', 'coverage')) {
                $table->text('coverage')->nullable()->after('price');
            }
            if (!Schema::hasColumn('plans', 'audience')) {
                $table->string('audience')->nullable()->after('coverage');
            }
        });
    }

    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            if (Schema::hasColumn('plans', 'audience')) {
                $table->dropColumn('audience');
            }
            if (Schema::hasColumn('plans', 'coverage')) {
                $table->dropColumn('coverage');
            }
            if (Schema::hasColumn('plans', 'price')) {
                $table->dropColumn('price');
            }
        });
    }
};
