<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'min:8', 'max:20'],
            'plan_id' => ['required', 'integer', 'exists:plans,id'],
            'notice_id' => ['nullable', 'integer', 'exists:notices,id'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }
}
