<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthRefreshController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Revoga o token atual
        $request->user()->currentAccessToken()->delete();
        
        // Cria um novo token com expiração de 24 horas
        $token = $user->createToken('auth_token', ['*'], now()->addHours(24))->plainTextToken;
        
        return response()->json([
            'message' => 'Token renovado com sucesso.',
            'user' => $user,
            'token' => $token,
        ]);
    }
}
