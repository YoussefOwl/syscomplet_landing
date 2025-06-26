<?php

namespace App\Models\Marques;

use Illuminate\Database\Eloquent\Model;

class marques extends Model
{
    protected $fillable = [
        'libelle_marque',
        'image',
        'description',
    ];
    protected $table = 'marques';
}
