<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubjectStoreRequest;
use App\Http\Requests\SubjectUpdateRequest;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $onlyWithQuizzes = (bool) $request->query('only_with_quizzes');

        $query = Subject::query()->orderBy('name');

        if ($onlyWithQuizzes) {
            $query->whereHas('quizzes', function ($builder) {
                $builder->where('needs_review', false)
                    ->where('validations_count', '>=', 3);
            });
        }

        return response()->json([
            'subjects' => $query->get(['id', 'name']),
        ]);
    }

    public function store(SubjectStoreRequest $request): JsonResponse
    {
        $subject = Subject::create($request->validated());

        return response()->json([
            'message' => 'Matéria cadastrada com sucesso.',
            'subject' => $subject,
        ], 201);
    }

    public function show(Subject $subject): JsonResponse
    {
        return response()->json([
            'subject' => $subject,
        ]);
    }

    public function update(SubjectUpdateRequest $request, Subject $subject): JsonResponse
    {
        $subject->update($request->validated());

        return response()->json([
            'message' => 'Matéria atualizada com sucesso.',
            'subject' => $subject,
        ]);
    }

    public function destroy(Subject $subject): JsonResponse
    {
        $subject->delete();

        return response()->json([
            'message' => 'Matéria excluída com sucesso.',
        ]);
    }
}
