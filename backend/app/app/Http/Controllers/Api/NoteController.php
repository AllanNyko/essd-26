<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NoteStoreRequest;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = (int) $request->query('user_id');

        if (! $userId) {
            return response()->json([
                'message' => 'Informe o user_id.',
            ], 422);
        }

        return response()->json([
            'notes' => Note::query()
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get(['id', 'user_id', 'notice_id', 'subject_id', 'score']),
        ]);
    }

    public function store(NoteStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        $existing = Note::query()
            ->where('user_id', $data['user_id'])
            ->where('subject_id', $data['subject_id'])
            ->exists();

        if ($existing) {
            return response()->json([
                'message' => 'Você já registrou nota para esta matéria.',
            ], 409);
        }

        $note = Note::create($data);

        return response()->json([
            'message' => 'Nota registrada com sucesso.',
            'note' => $note,
        ], 201);
    }
}
