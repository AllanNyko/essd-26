<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuizAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'selected_option' => ['nullable', 'string'],
            'timed_out' => ['sometimes', 'boolean'],
            'game_mode' => ['required', 'string', 'in:individual,survivor'],
            'time_left' => ['nullable', 'integer', 'min:0', 'max:20'],
        ];
    }
}
