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
        'term1_name',
        'term2_start',
        'term2_name',

        'term3_start',
        'term3_name',
        'term4_start',
        'term4_name',
        'term5_start',
        'term5_name',
        'term6_start',
        'term6_name',
    ];
}
