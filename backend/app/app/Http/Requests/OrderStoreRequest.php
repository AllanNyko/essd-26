<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_name' => ['required', 'string', 'min:3', 'max:255'],
            'shipping_phone' => ['required', 'string', 'max:20'],
            'shipping_address' => ['required', 'string', 'min:5'],
            'shipping_city' => ['required', 'string', 'min:2', 'max:100'],
            'shipping_state' => ['required', 'string', 'size:2'],
            'shipping_zip_code' => ['required', 'string', 'regex:/^\d{5}-?\d{3}$/'],
            'shipping_notes' => ['nullable', 'string'],
            'payment_method' => ['required', 'in:external,pix,credit_card,boleto'],
        ];
    }
}
