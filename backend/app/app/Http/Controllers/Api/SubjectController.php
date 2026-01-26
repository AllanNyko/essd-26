<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
}
