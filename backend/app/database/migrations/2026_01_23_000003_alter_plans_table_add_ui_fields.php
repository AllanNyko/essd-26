<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->string('currency', 3)->default('BRL')->after('price');
            $table->boolean('is_featured')->default(false)->after('features');
            $table->integer('sort_order')->default(0)->after('is_featured');
            $table->json('metadata')->nullable()->after('sort_order');
        });

        // Inicializar valores padrão para planos existentes
        DB::table('plans')->where('name', 'Básico')->update([
            'currency' => 'BRL',
            'is_featured' => false,
            'sort_order' => 1,
            'metadata' => json_encode([
                'uploads_per_month' => 10,
                'support' => 'email',
            ]),
        ]);

        DB::table('plans')->where('name', 'Premium')->update([
            'currency' => 'BRL',
            'is_featured' => true,
            'sort_order' => 2,
            'metadata' => json_encode([
                'uploads_per_month' => 'unlimited',
                'quizzes' => 'unlimited',
                'support' => 'priority',
            ]),
        ]);

        DB::table('plans')->where('name', 'Pro')->update([
            'currency' => 'BRL',
            'is_featured' => false,
            'sort_order' => 3,
            'metadata' => json_encode([
                'uploads_per_month' => 'unlimited',
                'mentorship_per_month' => 2,
                'ads' => false,
            ]),
        ]);
    }

    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['currency', 'is_featured', 'sort_order', 'metadata']);
        });
    }
};
