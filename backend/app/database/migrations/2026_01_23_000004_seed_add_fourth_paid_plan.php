<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Inserir novo plano pago
        DB::table('plans')->insert([
            'name' => 'Plus',
            'description' => 'Plano intermediário com mais recursos que o Básico.',
            'price' => 14.90,
            'currency' => 'BRL',
            'duration_days' => 30,
            'features' => json_encode([
                'Acesso a mapas mentais básicos e avançados',
                'Até 100 uploads por mês',
                'Quiz básicos',
                'Suporte por email'
            ]),
            'is_active' => true,
            'is_featured' => false,
            'sort_order' => 2,
            'metadata' => json_encode([
                'uploads_per_month' => 100,
                'quizzes' => 'basic',
                'support' => 'email',
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Atualizar ordenação dos existentes para acomodar o novo plano
        DB::table('plans')->where('name', 'Básico')->update(['sort_order' => 1]);
        DB::table('plans')->where('name', 'Premium')->update(['sort_order' => 3, 'is_featured' => true]);
        DB::table('plans')->where('name', 'Pro')->update(['sort_order' => 4]);
    }

    public function down(): void
    {
        DB::table('plans')->where('name', 'Plus')->delete();
        // Reverter ordenação
        DB::table('plans')->where('name', 'Básico')->update(['sort_order' => 1]);
        DB::table('plans')->where('name', 'Premium')->update(['sort_order' => 2]);
        DB::table('plans')->where('name', 'Pro')->update(['sort_order' => 3]);
    }
};
