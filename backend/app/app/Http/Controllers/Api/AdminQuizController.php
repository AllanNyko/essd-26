<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminQuizController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 20);
        $needsReview = $request->query('needs_review');
        $subjectId = $request->query('subject_id');
        
        $query = Quiz::query()
            ->with(['user:id,name,email', 'subject:id,name'])
            ->orderBy('created_at', 'desc');
        
        if ($needsReview !== null) {
            $query->where('needs_review', (bool) $needsReview);
        }
        
        if ($subjectId !== null) {
            $query->where('subject_id', $subjectId);
        }
        
        $paginated = $query->paginate($perPage);
        
        return response()->json([
            'quizzes' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'last_page' => $paginated->lastPage(),
            ],
        ]);
    }
}
