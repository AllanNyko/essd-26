<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserScoreUpdateRequest;
use App\Models\User;
use App\Models\UserScore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserScoreController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $userId = (int) $request->query('user_id');

        if (! $userId) {
            return response()->json([
                'message' => 'Informe o user_id.',
            ], 422);
        }

        $user = User::find($userId);

        if (! $user) {
            return response()->json([
                'message' => 'Usuário não encontrado.',
            ], 404);
        }

        $score = UserScore::firstOrCreate([
            'user_id' => $userId,
        ], [
            'quiz_points' => 0,
            'contribution_points' => 0,
        ]);

        return response()->json([
            'score' => $score,
        ]);
    }

    public function update(UserScoreUpdateRequest $request): JsonResponse
    {
        $data = $request->validated();
        $userId = (int) $data['user_id'];

        $score = UserScore::firstOrCreate([
            'user_id' => $userId,
        ], [
            'quiz_points' => 0,
            'contribution_points' => 0,
        ]);

        $updates = array_filter([
            'quiz_points' => $data['quiz_points'] ?? null,
            'contribution_points' => $data['contribution_points'] ?? null,
        ], fn ($value) => $value !== null);

        $score->update($updates);

        return response()->json([
            'message' => 'Pontuação atualizada com sucesso.',
            'score' => $score,
        ]);
    }
}
