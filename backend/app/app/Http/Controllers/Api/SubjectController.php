<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubjectStoreRequest;
use App\Http\Requests\SubjectUpdateRequest;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;

class SubjectController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'subjects' => Subject::query()->orderBy('name')->get(['id', 'name']),
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
