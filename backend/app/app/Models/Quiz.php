<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subject_id',
        'question',
        'option_one',
        'option_two',
        'option_three',
        'option_four',
        'validations_count',
        'hits',
        'errors',
        'invalidate_count',
        'needs_review',
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function quizValidations(): HasMany
    {
        return $this->hasMany(QuizValidation::class);
    }
}
