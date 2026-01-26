<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NoticeUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $noticeId = $this->route('notice')?->id;

        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique('notices', 'name')->ignore($noticeId),
            ],
        ];
    }
}
