<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'slug' => ['nullable', 'string', 'unique:products,slug', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'description' => ['required', 'string', 'min:10'],
            'price' => ['required', 'numeric', 'min:0.01'],
            'stock' => ['required', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', 'unique:products,sku'],
            'status' => ['nullable', 'in:draft,active,inactive'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'A categoria é obrigatória.',
            'category_id.exists' => 'A categoria selecionada não existe.',
            'name.required' => 'O nome do produto é obrigatório.',
            'name.min' => 'O nome do produto deve ter pelo menos :min caracteres.',
            'name.max' => 'O nome do produto não pode ter mais de :max caracteres.',
            'slug.unique' => 'Este slug já está sendo usado por outro produto.',
            'slug.regex' => 'O slug deve conter apenas letras minúsculas, números e hífens.',
            'description.required' => 'A descrição é obrigatória.',
            'description.min' => 'A descrição deve ter pelo menos :min caracteres.',
            'price.required' => 'O preço é obrigatório.',
            'price.numeric' => 'O preço deve ser um número válido.',
            'price.min' => 'O preço deve ser maior que zero.',
            'stock.required' => 'O estoque é obrigatório.',
            'stock.integer' => 'O estoque deve ser um número inteiro.',
            'stock.min' => 'O estoque não pode ser negativo.',
            'sku.unique' => 'Este SKU já está sendo usado por outro produto.',
            'status.in' => 'O status selecionado é inválido.',
            'images.max' => 'Você pode enviar no máximo :max imagens.',
            'images.*.image' => 'O arquivo deve ser uma imagem.',
            'images.*.max' => 'Cada imagem deve ter no máximo 2MB.',
        ];
    }
}
