<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserScoreUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'quiz_points' => ['nullable', 'integer', 'min:0', 'required_without:contribution_points'],
            'contribution_points' => ['nullable', 'integer', 'min:0', 'required_without:quiz_points'],
        ];
    }
}
