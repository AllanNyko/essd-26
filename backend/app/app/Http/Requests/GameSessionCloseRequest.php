<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GameSessionCloseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'quiz_id' => ['required', 'integer', 'exists:quizzes,id'],
            'mode' => ['required', 'string', 'in:individual,survivor'],
            'time_left' => ['nullable', 'integer', 'min:0', 'max:20'],
        ];
    }
}
