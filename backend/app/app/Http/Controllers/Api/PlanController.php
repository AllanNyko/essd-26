<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlanStoreRequest;
use App\Http\Requests\PlanUpdateRequest;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;

class PlanController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'plans' => Plan::query()->orderBy('name')->get(['id', 'name', 'price', 'coverage', 'audience']),
        ]);
    }

    public function store(PlanStoreRequest $request): JsonResponse
    {
        $plan = Plan::create($request->validated());

        return response()->json([
            'message' => 'Plano cadastrado com sucesso.',
            'plan' => $plan,
        ], 201);
    }

    public function show(Plan $plan): JsonResponse
    {
        return response()->json([
            'plan' => $plan,
        ]);
    }

    public function update(PlanUpdateRequest $request, Plan $plan): JsonResponse
    {
        $plan->update($request->validated());

        return response()->json([
            'message' => 'Plano atualizado com sucesso.',
            'plan' => $plan,
        ]);
    }

    public function destroy(Plan $plan): JsonResponse
    {
        $plan->delete();

        return response()->json([
            'message' => 'Plano excluído com sucesso.',
        ]);
    }
}
