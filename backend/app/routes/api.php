<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'backend',
    ]);
})->name('health');

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

Route::patch('/users/{user}', [UserController::class, 'update']);

Route::post('/materials/upload', [MaterialController::class, 'upload']);

Route::get('/subjects', [SubjectController::class, 'index']);

Route::post('/quizzes', [QuizController::class, 'store']);
