<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NoteStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'notice_id' => ['nullable', 'integer', 'exists:notices,id'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'score' => ['required', 'numeric', 'min:0', 'max:10'],
        ];
    }
}
