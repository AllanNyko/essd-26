<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
