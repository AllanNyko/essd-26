<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuizValidateRequest;
use App\Http\Requests\QuizStoreRequest;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;

class QuizController extends Controller
{
    public function store(QuizStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        $quiz = Quiz::create([
            'user_id' => $data['user_id'],
            'subject_id' => $data['subject_id'],
            'question' => $data['question'],
            'option_one' => $data['option_one'],
            'option_two' => $data['option_two'],
            'option_three' => $data['option_three'],
            'option_four' => $data['option_four'],
            'validations_count' => 0,
            'hits' => 0,
            'errors' => 0,
        ]);

        return response()->json([
            'message' => 'Quizz enviado com sucesso.',
            'quiz' => $quiz,
        ], 201);
    }

    public function next(): JsonResponse
    {
        $quiz = Quiz::query()
            ->where('validations_count', 0)
            ->orderBy('id')
            ->first();

        if (! $quiz) {
            return response()->json([
                'message' => 'Nenhum quizz disponível.',
                'quiz' => null,
            ]);
        }

        return response()->json([
            'quiz' => $quiz,
        ]);
    }

    public function validateQuiz(QuizValidateRequest $request, Quiz $quiz): JsonResponse
    {
        $action = $request->validated('action');

        if ($action === 'validate') {
            $quiz->increment('hits');
            $quiz->increment('validations_count');
        }

        if ($action === 'invalidate') {
            $quiz->increment('invalidate_count');
            $quiz->increment('validations_count');
        }

        return response()->json([
            'message' => $action === 'validate' ? 'Questão validada.' : 'Questão invalidada.',
        ]);
    }
}
