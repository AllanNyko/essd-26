<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAnswerLog extends Model
{
    protected $fillable = [
        'user_id',
        'quiz_id',
        'subject_id',
        'game_mode',
        'is_correct',
        'timed_out',
        'time_left',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'timed_out' => 'boolean',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }
}