<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NoticeStoreRequest;
use App\Http\Requests\NoticeUpdateRequest;
use App\Models\Notice;
use Illuminate\Http\JsonResponse;

class NoticeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'notices' => Notice::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(NoticeStoreRequest $request): JsonResponse
    {
        $notice = Notice::create($request->validated());

        return response()->json([
            'message' => 'Edital cadastrado com sucesso.',
            'notice' => $notice,
        ], 201);
    }

    public function show(Notice $notice): JsonResponse
    {
        return response()->json([
            'notice' => $notice,
        ]);
    }

    public function update(NoticeUpdateRequest $request, Notice $notice): JsonResponse
    {
        $notice->update($request->validated());

        return response()->json([
            'message' => 'Edital atualizado com sucesso.',
            'notice' => $notice,
        ]);
    }

    public function destroy(Notice $notice): JsonResponse
    {
        $notice->delete();

        return response()->json([
            'message' => 'Edital excluído com sucesso.',
        ]);
    }
}
