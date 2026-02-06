<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductReviewStoreRequest;
use App\Models\Order;
use App\Models\ProductReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ProductReview::with('user:id,name')
            ->orderBy('created_at', 'desc');

        if ($productId = $request->query('product_id')) {
            $query->where('product_id', $productId);
        }

        $reviews = $query->paginate(10);

        return response()->json($reviews);
    }

    public function store(ProductReviewStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        // Check if user already reviewed this product
        $existingReview = ProductReview::where('user_id', auth()->id())
            ->where('product_id', $data['product_id'])
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'Você já avaliou este produto.',
            ], 400);
        }

        // Check if user purchased this product
        $hasPurchased = Order::where('user_id', auth()->id())
            ->whereHas('items', function ($q) use ($data) {
                $q->where('product_id', $data['product_id']);
            })
            ->exists();

        $data['is_verified_purchase'] = $hasPurchased;

        $review = ProductReview::create($data);

        return response()->json([
            'message' => 'Avaliação enviada com sucesso.',
            'review' => $review->load('user'),
        ], 201);
    }

    public function destroy(ProductReview $review): JsonResponse
    {
        if ($review->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Avaliação excluída com sucesso.',
        ]);
    }
}
