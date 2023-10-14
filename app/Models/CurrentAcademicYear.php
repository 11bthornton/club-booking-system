<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class CurrentAcademicYear extends Model
{
    use HasFactory;

    protected $table = 'current_academic_years';

    protected $fillable = [
        'academic_year_id',
    ];

    /**
     * Get the related academic year.
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }
}
