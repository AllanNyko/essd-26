<?php

namespace Database\Seeders;

use App\Models\Note;
use App\Models\Notice;
use App\Models\Plan;
use App\Models\Quiz;
use App\Models\QuizAnswerLog;
use App\Models\Subject;
use App\Models\User;
use App\Models\UserScore;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

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

        $notice2026 = Notice::query()->updateOrCreate(
            ['name' => 'Edital 2026'],
            ['observation' => 'Edital principal para 2026.']
        );

        $notice2025 = Notice::query()->updateOrCreate(
            ['name' => 'Edital 2025'],
            ['observation' => 'Edital anterior para comparativos.']
        );

        $usersData = [
            ['name' => 'Test User', 'email' => 'test@example.com', 'notice_id' => $notice2026->id],
            ['name' => 'Julia Ramos', 'email' => 'julia@essd.local', 'notice_id' => $notice2026->id],
            ['name' => 'Lucas Almeida', 'email' => 'lucas@essd.local', 'notice_id' => $notice2025->id],
            ['name' => 'Marina Costa', 'email' => 'marina@essd.local', 'notice_id' => $notice2026->id],
            ['name' => 'Pedro Souza', 'email' => 'pedro@essd.local', 'notice_id' => $notice2025->id],
        ];

        $planId = Plan::query()->first()?->id;

        $users = collect($usersData)->map(function ($userData) use ($planId) {
            return User::query()->updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => bcrypt('password'),
                    'plan_id' => $planId,
                    'notice_id' => $userData['notice_id'],
                    'phone' => '11999990000',
                ]
            );
        });

        $mainUser = $users->first();

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
                    'user_id' => $mainUser->id,
                    'validations_count' => 3,
                    'hits' => 0,
                    'errors' => 0,
                    'invalidate_count' => 0,
                    'needs_review' => false,
                ])
            );
        }

        $subjects = Subject::query()->get();
        $quizzesBySubject = Quiz::query()->get()->groupBy('subject_id');

        foreach ($users as $user) {
            $noticeId = $user->notice_id;

            foreach ($subjects as $subject) {
                $score = round(mt_rand(55, 95) / 10, 1);
                $createdAt = Carbon::now()->subDays(mt_rand(1, 60));

                Note::query()->updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'subject_id' => $subject->id,
                        'notice_id' => $noticeId,
                    ],
                    [
                        'score' => $score,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]
                );

                $subjectQuizzes = $quizzesBySubject->get($subject->id, collect());
                if ($subjectQuizzes->isEmpty()) {
                    continue;
                }

                $logsCount = mt_rand(5, 10);
                for ($i = 0; $i < $logsCount; $i += 1) {
                    $quiz = $subjectQuizzes->random();
                    $isCorrect = (bool) mt_rand(0, 1);
                    $gameMode = mt_rand(0, 1) ? 'individual' : 'survivor';
                    $logCreatedAt = Carbon::now()->subDays(mt_rand(1, 45));

                    QuizAnswerLog::query()->create([
                        'user_id' => $user->id,
                        'quiz_id' => $quiz->id,
                        'subject_id' => $subject->id,
                        'game_mode' => $gameMode,
                        'is_correct' => $isCorrect,
                        'timed_out' => false,
                        'time_left' => mt_rand(0, 20),
                        'created_at' => $logCreatedAt,
                        'updated_at' => $logCreatedAt,
                    ]);
                }
            }

            $logs = QuizAnswerLog::query()->where('user_id', $user->id)->get();
            $hits = $logs->where('is_correct', true)->count();
            $errors = $logs->where('is_correct', false)->count();
            $individualHits = $logs->where('game_mode', 'individual')->where('is_correct', true)->count();
            $individualErrors = $logs->where('game_mode', 'individual')->where('is_correct', false)->count();
            $survivorHits = $logs->where('game_mode', 'survivor')->where('is_correct', true)->count();
            $survivorErrors = $logs->where('game_mode', 'survivor')->where('is_correct', false)->count();
            $quizPoints = $hits * 10;

            UserScore::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'quiz_points' => $quizPoints,
                    'individual_hits' => $individualHits,
                    'individual_errors' => $individualErrors,
                    'survivor_hits' => $survivorHits,
                    'survivor_errors' => $survivorErrors,
                    'individual_points' => $individualHits * 10,
                    'survivor_points' => $survivorHits * 12,
                ]
            );
        }
    }
}
