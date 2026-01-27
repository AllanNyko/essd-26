<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Quiz;
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

        $user = User::firstOrCreate([
            'email' => 'test@example.com',
        ], [
            'name' => 'Test User',
            'password' => 'password',
        ]);

        $quizzes = [
            [
                'subject_id' => 1,
                'question' => 'Quanto é 5 + 7?',
                'option_one' => '12',
                'option_two' => '10',
                'option_three' => '11',
                'option_four' => '13',
            ],
            [
                'subject_id' => 1,
                'question' => 'Qual é a raiz quadrada de 81?',
                'option_one' => '9',
                'option_two' => '8',
                'option_three' => '7',
                'option_four' => '10',
            ],
            [
                'subject_id' => 2,
                'question' => 'Qual é o plural de "cidadão"?',
                'option_one' => 'cidadãos',
                'option_two' => 'cidadões',
                'option_three' => 'cidadãs',
                'option_four' => 'cidadõeses',
            ],
            [
                'subject_id' => 2,
                'question' => 'Qual é a classe gramatical da palavra "rapidamente"?',
                'option_one' => 'advérbio',
                'option_two' => 'substantivo',
                'option_three' => 'adjetivo',
                'option_four' => 'verbo',
            ],
            [
                'subject_id' => 3,
                'question' => 'Qual órgão é responsável por bombear o sangue?',
                'option_one' => 'coração',
                'option_two' => 'pulmão',
                'option_three' => 'fígado',
                'option_four' => 'estômago',
            ],
            [
                'subject_id' => 3,
                'question' => 'Qual planeta é conhecido como Planeta Vermelho?',
                'option_one' => 'Marte',
                'option_two' => 'Vênus',
                'option_three' => 'Júpiter',
                'option_four' => 'Mercúrio',
            ],
            [
                'subject_id' => 4,
                'question' => 'Em que ano foi proclamada a República no Brasil?',
                'option_one' => '1889',
                'option_two' => '1822',
                'option_three' => '1930',
                'option_four' => '1964',
            ],
            [
                'subject_id' => 4,
                'question' => 'Qual civilização construiu as pirâmides de Gizé?',
                'option_one' => 'Egípcia',
                'option_two' => 'Romana',
                'option_three' => 'Grega',
                'option_four' => 'Mesopotâmica',
            ],
        ];

        foreach ($quizzes as $quiz) {
            Quiz::query()->updateOrCreate(
                [
                    'subject_id' => $quiz['subject_id'],
                    'question' => $quiz['question'],
                ],
                array_merge($quiz, [
                    'user_id' => $user->id,
                    'validations_count' => 3,
                    'hits' => 0,
                    'errors' => 0,
                    'invalidate_count' => 0,
                    'needs_review' => false,
                ])
            );
        }
    }
}
