<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VendorUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $vendorId = $this->route('vendor');
        
        return [
            'company_name' => ['sometimes', 'string', 'min:3', 'max:255'],
            'cnpj' => ['sometimes', 'string', 'size:18', 'unique:vendors,cnpj,' . $vendorId, 'regex:/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/'],
            'description' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'status' => ['sometimes', 'in:pending,approved,rejected'],
            'rejection_reason' => ['required_if:status,rejected', 'string'],
        ];
    }
}
