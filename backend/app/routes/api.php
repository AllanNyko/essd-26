<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthLogoutController;
use App\Http\Controllers\Api\AuthRefreshController;
use App\Http\Controllers\Api\AdminQuizController;
use App\Http\Controllers\Api\GameSessionHistoryController;
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
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductReviewController;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'backend',
    ]);
})->name('health');

Route::get('/ranking', [RankingController::class, 'index']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:3,1');
});

// Rotas que listar dados (públicas para facilitar acesso inicial)
Route::get('/subjects', [SubjectController::class, 'index']);
Route::get('/notices', [NoticeController::class, 'index']);
Route::get('/plans', [PlanController::class, 'index']);

// E-shop public routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/reviews', [ProductReviewController::class, 'index']);

// Rotas protegidas (exigem autenticação)
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/auth/logout', AuthLogoutController::class);
    Route::post('/auth/refresh', AuthRefreshController::class)->middleware('throttle:10,1');
    
    Route::patch('/users/{user}', [UserController::class, 'update']);
    
    Route::get('/scores', [UserScoreController::class, 'show']);
    Route::patch('/scores', [UserScoreController::class, 'update']);
    
    Route::post('/materials/upload', [MaterialController::class, 'upload']);
    
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::get('/subjects/{subject}', [SubjectController::class, 'show']);
    Route::patch('/subjects/{subject}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{subject}', [SubjectController::class, 'destroy']);
    
    Route::post('/notices', [NoticeController::class, 'store']);
    Route::get('/notices/{notice}', [NoticeController::class, 'show']);
    Route::patch('/notices/{notice}', [NoticeController::class, 'update']);
    Route::delete('/notices/{notice}', [NoticeController::class, 'destroy']);
    
    Route::post('/plans', [PlanController::class, 'store']);
    Route::get('/plans/{plan}', [PlanController::class, 'show']);
    Route::patch('/plans/{plan}', [PlanController::class, 'update']);
    Route::delete('/plans/{plan}', [PlanController::class, 'destroy']);
    
    Route::get('/notes', [NoteController::class, 'index']);
    Route::post('/notes', [NoteController::class, 'store']);
    
    Route::post('/game-sessions', [GameSessionController::class, 'store'])->middleware('throttle:30,1');
    Route::post('/game-sessions/close', [GameSessionController::class, 'close'])->middleware('throttle:30,1');
    Route::post('/game-sessions/expire', [GameSessionController::class, 'expire']);
    
    Route::post('/quizzes', [QuizController::class, 'store'])->middleware('throttle:20,1');
    Route::get('/quizzes/next', [QuizController::class, 'next']);
    Route::post('/quizzes/{quiz}/validate', [QuizController::class, 'validateQuiz'])->middleware('throttle:30,1');
    Route::get('/quizzes/play/next', [QuizController::class, 'playNext'])->middleware('throttle:30,1');
    Route::post('/quizzes/{quiz}/answer', [QuizController::class, 'answer'])->middleware('throttle:30,1');
    Route::get('/quiz-stats', [QuizStatsController::class, 'index']);
    
    // Rotas administrativas
    Route::get('/admin/quizzes', [AdminQuizController::class, 'index']);
    Route::get('/admin/game-sessions', [GameSessionHistoryController::class, 'index']);
    
    // E-shop: Vendor registration and profile
    Route::get('/vendors/me', [VendorController::class, 'myVendor']);
    Route::post('/vendors', [VendorController::class, 'store']);
    Route::patch('/vendors/{vendor}', [VendorController::class, 'update']);
    
    // E-shop: Cart management
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::patch('/cart/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);
    
    // E-shop: Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    Route::get('/vendor/orders', [OrderController::class, 'vendorOrders']);
    
    // E-shop: Reviews
    Route::post('/reviews', [ProductReviewController::class, 'store']);
    Route::delete('/reviews/{review}', [ProductReviewController::class, 'destroy']);
    
    // E-shop: Vendor/Admin routes (with role middleware)
    Route::middleware('role:vendor,admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::patch('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        Route::delete('/products/{product}/images/{image}', [ProductController::class, 'deleteImage']);
        Route::post('/products/{product}/images/{image}/set-primary', [ProductController::class, 'setPrimaryImage']);
    });
    
    // E-shop: Admin only routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/vendors', [VendorController::class, 'index']);
        Route::get('/vendors/{vendor}', [VendorController::class, 'show']);
        Route::delete('/vendors/{vendor}', [VendorController::class, 'destroy']);
        
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::patch('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });
});
