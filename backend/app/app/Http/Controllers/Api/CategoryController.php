<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Category::with('parent:id,name')->orderBy('order')->orderBy('name');

        if ($request->query('active_only')) {
            $query->where('is_active', true);
        }

        if ($parentId = $request->query('parent_id')) {
            if ($parentId === 'null') {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $parentId);
            }
        }

        $categories = $query->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function store(CategoryStoreRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return response()->json([
            'message' => 'Categoria criada com sucesso.',
            'category' => $category->load('parent'),
        ], 201);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'category' => $category->load(['parent', 'children']),
        ]);
    }

    public function update(CategoryUpdateRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());

        return response()->json([
            'message' => 'Categoria atualizada com sucesso.',
            'category' => $category->load('parent'),
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'message' => 'Categoria excluída com sucesso.',
        ]);
    }
}
