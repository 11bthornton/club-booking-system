<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YearGroup extends Model
{
    use HasFactory;

    protected $primaryKey = 'year';
    public $incrementing = false;
    protected $keyType = 'string';

}
