<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->integer('duration_days');
            $table->json('features')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Inserir planos padrão
        DB::table('plans')->insert([
            [
                'name' => 'Básico',
                'description' => 'Perfeito para começar seus estudos',
                'price' => 0.00,
                'duration_days' => 365,
                'features' => json_encode([
                    'Acesso a mapas mentais básicos',
                    'Até 10 uploads por mês',
                    'Suporte por email'
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Premium',
                'description' => 'Para estudantes que querem ir além',
                'price' => 29.90,
                'duration_days' => 30,
                'features' => json_encode([
                    'Acesso ilimitado a todos os recursos',
                    'Uploads ilimitados',
                    'Quiz interativos',
                    'Validação da comunidade',
                    'Suporte prioritário'
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pro',
                'description' => 'Tudo do Premium com vantagens exclusivas',
                'price' => 79.90,
                'duration_days' => 90,
                'features' => json_encode([
                    'Tudo do plano Premium',
                    'Acesso a materiais exclusivos',
                    'Mentoria individual (2x/mês)',
                    'Certificados de conclusão',
                    'Sem anúncios'
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
