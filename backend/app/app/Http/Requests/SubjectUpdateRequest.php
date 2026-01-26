<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubjectUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $subjectId = $this->route('subject')?->id;

        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique('subjects', 'name')->ignore($subjectId),
            ],
        ];
    }
}
