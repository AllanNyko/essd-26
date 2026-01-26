<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuizValidateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:validate,invalidate'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
