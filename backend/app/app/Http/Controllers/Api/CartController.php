<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartItemStoreRequest;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(): JsonResponse
    {
        $cartItems = CartItem::where('user_id', auth()->id())
            ->with(['product.images', 'product.vendor:id,name'])
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->price_snapshot;
        });

        return response()->json([
            'cart_items' => $cartItems,
            'total' => $total,
            'items_count' => $cartItems->count(),
        ]);
    }

    public function store(CartItemStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $product = Product::findOrFail($data['product_id']);

        // Check stock
        if ($product->stock < $data['quantity']) {
            return response()->json([
                'message' => 'Estoque insuficiente.',
            ], 400);
        }

        // Check if item already in cart
        $cartItem = CartItem::where('user_id', auth()->id())
            ->where('product_id', $data['product_id'])
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $data['quantity'];
            
            if ($product->stock < $newQuantity) {
                return response()->json([
                    'message' => 'Estoque insuficiente.',
                ], 400);
            }

            $cartItem->update([
                'quantity' => $newQuantity,
                'price_snapshot' => $product->price,
            ]);
        } else {
            $cartItem = CartItem::create([
                'user_id' => auth()->id(),
                'product_id' => $data['product_id'],
                'quantity' => $data['quantity'],
                'price_snapshot' => $product->price,
            ]);
        }

        return response()->json([
            'message' => 'Produto adicionado ao carrinho.',
            'cart_item' => $cartItem->load('product'),
        ], 201);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        if ($cartItem->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = $cartItem->product;

        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Estoque insuficiente.',
            ], 400);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return response()->json([
            'message' => 'Carrinho atualizado.',
            'cart_item' => $cartItem,
        ]);
    }

    public function destroy(CartItem $cartItem): JsonResponse
    {
        if ($cartItem->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $cartItem->delete();

        return response()->json([
            'message' => 'Item removido do carrinho.',
        ]);
    }

    public function clear(): JsonResponse
    {
        CartItem::where('user_id', auth()->id())->delete();

        return response()->json([
            'message' => 'Carrinho limpo.',
        ]);
    }
}
