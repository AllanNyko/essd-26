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
        'accuracy_percentage',
        'difficulty_label',
        'invalidate_count',
        'needs_review',
    ];

    public function recalculateDifficulty(): void
    {
        $hits = (int) ($this->hits ?? 0);
        $errors = (int) ($this->errors ?? 0);
        $total = $hits + $errors;
        $rawPercentage = $total > 0 ? ($hits / $total) * 100 : 0;
        $percentage = round(max(0, $rawPercentage), 2);

        if ($percentage < 30) {
            $difficulty = 'Difícil';
        } elseif ($percentage < 70) {
            $difficulty = 'Média';
        } else {
            $difficulty = 'Fácil';
        }

        $this->forceFill([
            'accuracy_percentage' => $percentage,
            'difficulty_label' => $difficulty,
        ])->save();
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function quizValidations(): HasMany
    {
        return $this->hasMany(QuizValidation::class);
    }
}
