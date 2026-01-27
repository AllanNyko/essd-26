<?php

namespace App\Http\Requests;

use App\Models\Notice;
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
        $routeNotice = $this->route('notice');
        $noticeId = $routeNotice instanceof Notice ? $routeNotice->id : $routeNotice;

        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique('notices', 'name')->ignore($noticeId),
            ],
            'observation' => ['required', 'string', 'min:1', 'max:50'],
        ];
    }
}
