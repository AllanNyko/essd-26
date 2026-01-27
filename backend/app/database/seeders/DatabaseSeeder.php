<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Plan::query()->updateOrCreate(
            ['name' => 'Plano Essencial'],
            [
                'price' => 29.9,
                'coverage' => 'Acesso básico ao conteúdo e materiais essenciais.',
                'audience' => 'Iniciantes e revisão leve',
            ]
        );

        Plan::query()->updateOrCreate(
            ['name' => 'Plano Avançado'],
            [
                'price' => 59.9,
                'coverage' => 'Conteúdo completo, simulados e trilhas de estudo.',
                'audience' => 'Estudantes em preparação intensiva',
            ]
        );

        Plan::query()->updateOrCreate(
            ['name' => 'Plano Premium'],
            [
                'price' => 99.9,
                'coverage' => 'Tudo do avançado + apoio especializado e revisão guiada.',
                'audience' => 'Alta performance e revisão final',
            ]
        );

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
