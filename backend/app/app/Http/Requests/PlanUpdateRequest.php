<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PlanUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $planId = $this->route('plan')?->id;

        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique('plans', 'name')->ignore($planId),
            ],
            'price' => ['required', 'numeric', 'min:0'],
            'coverage' => ['required', 'string', 'min:5'],
            'audience' => ['required', 'string', 'min:3', 'max:255'],
        ];
    }
}
