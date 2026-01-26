<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuizStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'question' => ['required', 'string', 'min:20'],
            'option_one' => ['required', 'string', 'min:2'],
            'option_two' => ['required', 'string', 'min:2'],
            'option_three' => ['required', 'string', 'min:2'],
            'option_four' => ['required', 'string', 'min:2'],
        ];
    }
}
