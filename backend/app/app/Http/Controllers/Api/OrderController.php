<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderStoreRequest;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::where('user_id', auth()->id())
            ->with(['items.product.images'])
            ->orderBy('created_at', 'desc');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $orders = $query->paginate(10);

        return response()->json($orders);
    }

    public function store(OrderStoreRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            // Get cart items
            $cartItems = CartItem::where('user_id', auth()->id())
                ->with('product')
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'message' => 'Carrinho vazio.',
                ], 400);
            }

            // Validate stock
            foreach ($cartItems as $item) {
                if ($item->product->stock < $item->quantity) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Estoque insuficiente para o produto: {$item->product->name}",
                    ], 400);
                }
            }

            // Calculate totals
            $subtotal = $cartItems->sum(function ($item) {
                return $item->quantity * $item->price_snapshot;
            });

            $shippingCost = 0; // TODO: Calculate shipping

            // Create order
            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => Order::generateOrderNumber(),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total' => $subtotal + $shippingCost,
                ...$request->validated(),
            ]);

            // Create order items and update stock
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'vendor_id' => $item->product->vendor_id,
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->price_snapshot,
                    'subtotal' => $item->quantity * $item->price_snapshot,
                ]);

                // Decrease stock
                $item->product->decrement('stock', $item->quantity);
            }

            // Clear cart
            CartItem::where('user_id', auth()->id())->delete();

            DB::commit();

            return response()->json([
                'message' => 'Pedido realizado com sucesso.',
                'order' => $order->load('items'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao processar pedido.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Order $order): JsonResponse
    {
        if ($order->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        return response()->json([
            'order' => $order->load(['items.product.images', 'items.vendor:id,name']),
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        // Only admins or vendors can update order status
        if (!auth()->user()->isAdmin() && !auth()->user()->isVendor()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $request->validate([
            'status' => ['required', 'in:pending,processing,shipped,delivered,cancelled'],
        ]);

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status do pedido atualizado.',
            'order' => $order,
        ]);
    }

    public function vendorOrders(Request $request): JsonResponse
    {
        if (!auth()->user()->isVendor() && !auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $query = OrderItem::where('vendor_id', auth()->id())
            ->with(['order.user:id,name,email', 'product:id,name'])
            ->orderBy('created_at', 'desc');

        if ($status = $request->query('status')) {
            $query->whereHas('order', function ($q) use ($status) {
                $q->where('status', $status);
            });
        }

        $orderItems = $query->paginate(15);

        return response()->json($orderItems);
    }
}
