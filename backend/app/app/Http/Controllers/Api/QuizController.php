<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuizValidateRequest;
use App\Http\Requests\QuizStoreRequest;
use App\Models\Quiz;
use App\Models\QuizValidation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function next(Request $request): JsonResponse
    {
        $userId = (int) $request->query('user_id');

        if (! $userId) {
            return response()->json([
                'message' => 'Informe o user_id.',
            ], 422);
        }

        $quiz = Quiz::query()
            ->where('needs_review', false)
            ->where('validations_count', '<', 3)
            ->where('user_id', '!=', $userId)
            ->whereDoesntHave('quizValidations', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
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
        $userId = (int) $request->validated('user_id');

        if ($quiz->user_id === $userId) {
            return response()->json([
                'message' => 'Você não pode validar seu próprio quizz.',
            ], 403);
        }

        $alreadyValidated = QuizValidation::query()
            ->where('quiz_id', $quiz->id)
            ->where('user_id', $userId)
            ->exists();

        if ($alreadyValidated) {
            return response()->json([
                'message' => 'Você já validou este quizz.',
            ], 409);
        }

        if ($action === 'validate') {
            $quiz->increment('hits');
            $quiz->increment('validations_count');
        }

        if ($action === 'invalidate') {
            $quiz->increment('invalidate_count');
            $quiz->increment('validations_count');

            $quiz->refresh();
            if ($quiz->invalidate_count >= 5) {
                $quiz->needs_review = true;
                $quiz->save();
            }
        }

        QuizValidation::create([
            'quiz_id' => $quiz->id,
            'user_id' => $userId,
            'action' => $action,
        ]);

        return response()->json([
            'message' => $action === 'validate' ? 'Questão validada.' : 'Questão invalidada.',
        ]);
    }
}
