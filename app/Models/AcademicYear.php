<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

    protected $fillable = [
        'year_start', 
        'year_end', 
        'term1_start',
        'term2_start',
        'term3_start',
        'term4_start',
        'term5_start',
        'term6_start',

    ];
}
