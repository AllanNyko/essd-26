<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product');
        
        return [
            'category_id' => ['sometimes', 'exists:categories,id'],
            'name' => ['sometimes', 'string', 'min:3', 'max:255'],
            'slug' => ['sometimes', 'string', 'unique:products,slug,' . $productId, 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'description' => ['sometimes', 'string', 'min:10'],
            'price' => ['sometimes', 'numeric', 'min:0.01'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', 'unique:products,sku,' . $productId],
            'status' => ['sometimes', 'in:draft,active,inactive'],
            'images' => ['sometimes', 'array', 'max:5'],
            'images.*' => ['image', 'max:2048'],
        ];
    }
}
