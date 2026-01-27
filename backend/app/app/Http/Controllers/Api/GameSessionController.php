<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GameSessionCloseRequest;
use App\Http\Requests\GameSessionStoreRequest;
use App\Models\GameSession;
use App\Models\Quiz;
use App\Models\UserScore;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class GameSessionController extends Controller
{
    public function store(GameSessionStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        $session = GameSession::create([
            'user_id' => $data['user_id'],
            'quiz_id' => $data['quiz_id'],
            'mode' => $data['mode'],
            'status' => 'active',
            'time_left' => (int) ($data['time_left'] ?? 0),
            'expires_at' => now()->addSeconds(25),
        ]);

        return response()->json([
            'session' => $session,
        ], 201);
    }

    public function close(GameSessionCloseRequest $request): JsonResponse
    {
        $data = $request->validated();

        $session = GameSession::query()
            ->where('user_id', $data['user_id'])
            ->where('quiz_id', $data['quiz_id'])
            ->where('mode', $data['mode'])
            ->where('status', 'active')
            ->latest('id')
            ->first();

        if (! $session) {
            return response()->json([
                'message' => 'Sessão não encontrada ou já finalizada.',
            ], 404);
        }

        $updated = GameSession::query()
            ->where('id', $session->id)
            ->where('status', 'active')
            ->update([
                'status' => 'closed',
                'completed_at' => now(),
                'time_left' => (int) ($data['time_left'] ?? $session->time_left),
            ]);

        if (! $updated) {
            return response()->json([
                'message' => 'Sessão já encerrada.',
            ]);
        }

        DB::transaction(function () use ($data) {
            $quiz = Quiz::find($data['quiz_id']);

            if ($quiz) {
                $quiz->increment('errors');
                $quiz->refresh();
                $quiz->recalculateDifficulty();
            }

            $score = UserScore::firstOrCreate([
                'user_id' => (int) $data['user_id'],
            ]);

            if ($data['mode'] === 'survivor') {
                $score->increment('survivor_errors');
            } else {
                $score->increment('individual_errors');
            }
        });

        return response()->json([
            'message' => 'Sessão encerrada e questão marcada como erro.',
        ]);
    }

    public function expire(): JsonResponse
    {
        $expired = GameSession::query()
            ->where('status', 'active')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->get();

        foreach ($expired as $session) {
            $updated = GameSession::query()
                ->where('id', $session->id)
                ->where('status', 'active')
                ->update([
                    'status' => 'expired',
                    'completed_at' => now(),
                ]);

            if (! $updated) {
                continue;
            }

            DB::transaction(function () use ($session) {
                $quiz = Quiz::find($session->quiz_id);
                if ($quiz) {
                    $quiz->increment('errors');
                    $quiz->refresh();
                    $quiz->recalculateDifficulty();
                }

                $score = UserScore::firstOrCreate([
                    'user_id' => $session->user_id,
                ]);

                if ($session->mode === 'survivor') {
                    $score->increment('survivor_errors');
                } else {
                    $score->increment('individual_errors');
                }
            });
        }

        return response()->json([
            'expired_sessions' => $expired->count(),
        ]);
    }
}
