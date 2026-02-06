<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameSessionHistoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 20);
        $userId = $request->query('user_id');
        $mode = $request->query('mode');
        $status = $request->query('status');
        
        $query = GameSession::query()
            ->with(['user:id,name,email', 'quiz:id,question,subject_id'])
            ->orderBy('created_at', 'desc');
        
        if ($userId !== null) {
            $query->where('user_id', $userId);
        }
        
        if ($mode !== null) {
            $query->where('mode', $mode);
        }
        
        if ($status !== null) {
            $query->where('status', $status);
        }
        
        $paginated = $query->paginate($perPage);
        
        return response()->json([
            'sessions' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'last_page' => $paginated->lastPage(),
            ],
        ]);
    }
}
