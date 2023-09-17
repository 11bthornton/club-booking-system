<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncompatibleClub extends Model
{
    use HasFactory;

    public $timestamps = false;


    protected $table = 'incompatible_clubs';

    protected $fillable = [
        'club_instance_id_1',
        'club_instance_id_2',
    ];

    public function clubInstance1()
    {
        return $this->belongsTo(ClubInstance::class, 'club_instance_id_1');
    }

    public function clubInstance2()
    {
        return $this->belongsTo(ClubInstance::class, 'club_instance_id_2');
    }
}
