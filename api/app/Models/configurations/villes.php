<?php

namespace App\Models\configurations;
use Illuminate\Database\Eloquent\Model;

class villes extends Model
{
    protected $fillable = [
        'libelle_ville',
        'description',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $table = 'villes';
    protected $primaryKey = 'id';
}