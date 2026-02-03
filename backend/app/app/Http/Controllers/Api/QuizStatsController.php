<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuizAnswerLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizStatsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = (int) $request->query('user_id');
        $subjectId = $request->query('subject_id');
        $periodDays = $request->query('period_days');

        if (! $userId) {
            return response()->json([
                'message' => 'Informe o user_id.',
            ], 422);
        }

        $baseQuery = QuizAnswerLog::query()->where('quiz_answer_logs.user_id', $userId);

        if ($subjectId && is_numeric($subjectId)) {
            $baseQuery->where('quiz_answer_logs.subject_id', (int) $subjectId);
        }

        if ($periodDays && is_numeric($periodDays)) {
            $baseQuery->where('quiz_answer_logs.created_at', '>=', now()->subDays((int) $periodDays));
        }

        $totals = (clone $baseQuery)
            ->selectRaw('SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as hits')
            ->selectRaw('SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) as errors')
            ->selectRaw('COUNT(*) as total')
            ->first();

        $totalQuestions = (int) ($totals->total ?? 0);
        $totalHits = (int) ($totals->hits ?? 0);
        $totalErrors = (int) ($totals->errors ?? 0);
        $accuracy = $totalQuestions > 0 ? ($totalHits / $totalQuestions) * 100 : 0;

        $subjects = (clone $baseQuery)
            ->join('subjects', 'subjects.id', '=', 'quiz_answer_logs.subject_id')
            ->select('quiz_answer_logs.subject_id', 'subjects.name')
            ->selectRaw('SUM(CASE WHEN quiz_answer_logs.is_correct = 1 THEN 1 ELSE 0 END) as hits')
            ->selectRaw('SUM(CASE WHEN quiz_answer_logs.is_correct = 0 THEN 1 ELSE 0 END) as errors')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('quiz_answer_logs.subject_id', 'subjects.name')
            ->orderBy('subjects.name')
            ->get()
            ->map(function ($row) {
                $total = (int) ($row->total ?? 0);
                $hits = (int) ($row->hits ?? 0);
                $errors = (int) ($row->errors ?? 0);
                $accuracy = $total > 0 ? ($hits / $total) * 100 : 0;

                return [
                    'subject_id' => (int) $row->subject_id,
                    'subject_name' => $row->name,
                    'total_questions' => $total,
                    'hits' => $hits,
                    'errors' => $errors,
                    'accuracy_percentage' => round($accuracy, 2),
                ];
            });

        return response()->json([
            'stats' => [
                'total_questions' => $totalQuestions,
                'hits' => $totalHits,
                'errors' => $totalErrors,
                'accuracy_percentage' => round($accuracy, 2),
            ],
            'subjects' => $subjects,
        ]);
    }
}