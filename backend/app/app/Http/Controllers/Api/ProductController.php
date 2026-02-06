<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['vendor:id,name', 'category:id,name', 'images'])
            ->withCount('reviews')
            ->orderBy('created_at', 'desc');

        // Filter by vendor (for vendor dashboard)
        if ($vendorId = $request->query('vendor_id')) {
            $query->where('vendor_id', $vendorId);
        }

        // Filter by category
        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // Filter by status
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        } else {
            // Public view only shows active products
            if (!$request->user() || $request->user()->role === 'student') {
                $query->where('status', 'active');
            }
        }

        // Search
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->query('sort_by', 'created_at');
        $sortOrder = $request->query('sort_order', 'desc');
        
        if ($sortBy === 'price') {
            $query->orderBy('price', $sortOrder);
        } elseif ($sortBy === 'name') {
            $query->orderBy('name', $sortOrder);
        } else {
            $query->orderBy('created_at', $sortOrder);
        }

        $products = $query->paginate(12);

        return response()->json($products);
    }

    public function store(ProductStoreRequest $request): JsonResponse
    {
        Gate::authorize('create', Product::class);

        DB::beginTransaction();
        try {
            $data = $request->validated();
            $data['vendor_id'] = auth()->id();
            
            $images = $data['images'] ?? [];
            unset($data['images']);

            $product = Product::create($data);

            // Upload images
            foreach ($images as $index => $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $path,
                    'is_primary' => $index === 0,
                    'order' => $index,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Produto cadastrado com sucesso.',
                'product' => $product->load(['images', 'category', 'vendor']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao cadastrar produto.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        $product = Product::with([
            'vendor:id,name,email',
            'category:id,name',
            'images',
            'reviews.user:id,name',
        ])
        ->withCount('reviews')
        ->findOrFail($id);

        // Increment views
        $product->increment('views');

        // Add average rating
        $product->average_rating = $product->averageRating();

        return response()->json([
            'product' => $product,
        ]);
    }

    public function update(ProductUpdateRequest $request, Product $product): JsonResponse
    {
        Gate::authorize('update', $product);

        DB::beginTransaction();
        try {
            $data = $request->validated();
            
            $images = $data['images'] ?? null;
            unset($data['images']);

            $product->update($data);

            // Upload new images if provided
            if ($images) {
                foreach ($images as $index => $image) {
                    $path = $image->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $path,
                        'is_primary' => false,
                        'order' => $product->images()->count() + $index,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Produto atualizado com sucesso.',
                'product' => $product->load(['images', 'category', 'vendor']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao atualizar produto.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Product $product): JsonResponse
    {
        Gate::authorize('delete', $product);

        $product->delete();

        return response()->json([
            'message' => 'Produto excluído com sucesso.',
        ]);
    }

    public function deleteImage($productId, $imageId): JsonResponse
    {
        $product = Product::findOrFail($productId);
        Gate::authorize('update', $product);

        $image = ProductImage::where('product_id', $productId)
            ->where('id', $imageId)
            ->firstOrFail();

        $image->delete();

        return response()->json([
            'message' => 'Imagem excluída com sucesso.',
        ]);
    }

    public function setPrimaryImage($productId, $imageId): JsonResponse
    {
        $product = Product::findOrFail($productId);
        Gate::authorize('update', $product);

        DB::transaction(function () use ($productId, $imageId) {
            ProductImage::where('product_id', $productId)->update(['is_primary' => false]);
            ProductImage::where('product_id', $productId)
                ->where('id', $imageId)
                ->update(['is_primary' => true]);
        });

        return response()->json([
            'message' => 'Imagem principal definida com sucesso.',
        ]);
    }
}
