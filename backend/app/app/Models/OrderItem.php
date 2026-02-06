<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'vendor_id',
        'product_name',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($orderItem) {
            if ($orderItem->product) {
                if (empty($orderItem->vendor_id)) {
                    $orderItem->vendor_id = $orderItem->product->vendor_id;
                }
                if (empty($orderItem->product_name)) {
                    $orderItem->product_name = $orderItem->product->name;
                }
                if (empty($orderItem->unit_price)) {
                    $orderItem->unit_price = $orderItem->product->price;
                }
                if (empty($orderItem->subtotal)) {
                    $orderItem->subtotal = $orderItem->unit_price * $orderItem->quantity;
                }
            }
        });
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }
}
