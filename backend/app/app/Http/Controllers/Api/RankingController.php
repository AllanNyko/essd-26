<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RankingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $noticeId = $request->query('notice_id');
        $perPage = (int) $request->query('per_page', 15);

        $query = User::query()
            ->join('notes', 'notes.user_id', '=', 'users.id')
            ->leftJoin('user_scores', 'user_scores.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                'users.email',
                'users.avatar_url',
                DB::raw('COALESCE(MAX(user_scores.quiz_points), 0) as quiz_points'),
                DB::raw('AVG(notes.score) as average_score'),
                DB::raw('SUM(notes.score) as total_score'),
                DB::raw('COUNT(notes.id) as total_notes')
            )
            ->groupBy('users.id', 'users.name', 'users.email', 'users.avatar_url')
            ->orderByDesc('average_score');

        if ($noticeId !== null) {
            $query->where('notes.notice_id', $noticeId);
        }

        $paginated = $query->paginate($perPage);

        return response()->json([
            'ranking' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'last_page' => $paginated->lastPage(),
            ],
        ]);
    }
}
