<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quiz_points',
        'contribution_points',
        'individual_hits',
        'individual_errors',
        'survivor_hits',
        'survivor_errors',
        'individual_points',
        'survivor_points',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
