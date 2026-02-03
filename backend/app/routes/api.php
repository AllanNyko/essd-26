<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\NoticeController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\QuizStatsController;
use App\Http\Controllers\Api\RankingController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserScoreController;
use App\Http\Controllers\Api\GameSessionController;
use Illuminate\Support\Facades\Route;
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'backend',
    ]);
})->name('health');

Route::get('/scores', [UserScoreController::class, 'show']);
Route::patch('/scores', [UserScoreController::class, 'update']);
Route::get('/ranking', [RankingController::class, 'index']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

Route::patch('/users/{user}', [UserController::class, 'update']);

Route::post('/materials/upload', [MaterialController::class, 'upload']);

Route::get('/subjects', [SubjectController::class, 'index']);
Route::post('/subjects', [SubjectController::class, 'store']);
Route::get('/subjects/{subject}', [SubjectController::class, 'show']);
Route::patch('/subjects/{subject}', [SubjectController::class, 'update']);
Route::delete('/subjects/{subject}', [SubjectController::class, 'destroy']);

Route::get('/notices', [NoticeController::class, 'index']);
Route::post('/notices', [NoticeController::class, 'store']);
Route::get('/notices/{notice}', [NoticeController::class, 'show']);
Route::patch('/notices/{notice}', [NoticeController::class, 'update']);
Route::delete('/notices/{notice}', [NoticeController::class, 'destroy']);

Route::get('/plans', [PlanController::class, 'index']);
Route::post('/plans', [PlanController::class, 'store']);
Route::get('/plans/{plan}', [PlanController::class, 'show']);
Route::patch('/plans/{plan}', [PlanController::class, 'update']);
Route::delete('/plans/{plan}', [PlanController::class, 'destroy']);

Route::get('/notes', [NoteController::class, 'index']);
Route::post('/notes', [NoteController::class, 'store']);

Route::post('/game-sessions', [GameSessionController::class, 'store']);
Route::post('/game-sessions/close', [GameSessionController::class, 'close']);
Route::post('/game-sessions/expire', [GameSessionController::class, 'expire']);

Route::post('/quizzes', [QuizController::class, 'store']);
Route::get('/quizzes/next', [QuizController::class, 'next']);
Route::post('/quizzes/{quiz}/validate', [QuizController::class, 'validateQuiz']);
Route::get('/quizzes/play/next', [QuizController::class, 'playNext']);
Route::post('/quizzes/{quiz}/answer', [QuizController::class, 'answer']);
Route::get('/quiz-stats', [QuizStatsController::class, 'index']);
