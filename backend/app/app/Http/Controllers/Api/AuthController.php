<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'min:10', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'plan_id' => ['required', 'integer', 'exists:plans,id'],
        ]);

        // Verificar se o plano está ativo
        $plan = Plan::where('id', $validated['plan_id'])
            ->where('is_active', true)
            ->first();

        if (!$plan) {
            return response()->json([
                'success' => false,
                'message' => 'Plano selecionado não está disponível.'
            ], 422);
        }

        $sanitizedPhone = preg_replace('/\D+/', '', $validated['phone']);

        // Calcular data de expiração do plano
        $planExpiresAt = now()->addDays($plan->duration_days);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $sanitizedPhone,
            'password' => $validated['password'],
            'plan_id' => $validated['plan_id'],
            'plan_expires_at' => $planExpiresAt,
        ]);

        $token = $user->createToken('api')->plainTextToken;

        // Carregar relacionamento do plano
        $user->load('plan');

        return response()->json([
            'success' => true,
            'message' => 'Cadastro realizado com sucesso!',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciais inválidas.',
            ], 401);
        }

        $token = $user->createToken('api')->plainTextToken;

        // Carregar relacionamento do plano
        $user->load('plan');

        return response()->json([
            'success' => true,
            'message' => 'Login realizado com sucesso!',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuário não autenticado.'
            ], 401);
        }

        $user->load('plan');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuário não autenticado.'
            ], 401);
        }

        // Debug: Log do que foi recebido
        \Log::info('Update profile request - Headers', [
            'content_type' => $request->header('Content-Type'),
            'content_length' => $request->header('Content-Length'),
        ]);
        \Log::info('Update profile request - Data', [
            'user_id' => $user->id,
            'has_name' => $request->has('name'),
            'has_email' => $request->has('email'),
            'has_phone' => $request->has('phone'),
            'has_avatar' => $request->hasFile('avatar'),
            'avatar_file_name' => $request->hasFile('avatar') ? $request->file('avatar')->getClientOriginalName() : 'NONE',
            'request_all' => array_keys($request->all()),
            'files_all' => array_keys($request->allFiles()),
        ]);

        // Validação condicional - apenas valida campos que foram enviados
        $rules = [
            'avatar' => ['nullable', 'image', 'max:2048'],
        ];

        if ($request->has('name')) {
            $rules['name'] = ['required', 'string', 'max:255'];
        }

        if ($request->has('email')) {
            $rules['email'] = ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)];
        }

        if ($request->has('phone')) {
            $rules['phone'] = ['required', 'string', 'min:10', 'max:20'];
        }

        $validated = $request->validate($rules);

        $updateData = [];

        if (isset($validated['name'])) {
            $updateData['name'] = $validated['name'];
        }

        if (isset($validated['email'])) {
            $updateData['email'] = $validated['email'];
        }

        if (isset($validated['phone'])) {
            $updateData['phone'] = preg_replace('/\D+/', '', $validated['phone']);
        }

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $updateData['avatar_path'] = $path;
            \Log::info('Avatar uploaded', [
                'user_id' => $user->id,
                'path' => $path,
            ]);
        }

        if (!empty($updateData)) {
            $user->update($updateData);
        }
        
        // Sempre recarregar do banco para ter os dados mais recentes
        $user->refresh();
        $user->load('plan');
        
        \Log::info('User after update', [
            'user_id' => $user->id,
            'avatar_path' => $user->avatar_path,
            'avatar_url' => $user->avatar_url,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Perfil atualizado com sucesso.',
            'data' => [
                'user' => $user,
            ],
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $status = Password::sendResetLink(['email' => $validated['email']]);

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'message' => __($status),
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        
        if ($user) {
            // Deletar o token atual
            $request->user()->currentAccessToken()?->delete();
            
            \Log::info('User logged out', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logout realizado com sucesso.',
        ]);
    }
}
