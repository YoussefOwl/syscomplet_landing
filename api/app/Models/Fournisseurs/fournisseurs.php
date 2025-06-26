<?php

namespace App\Models\Fournisseurs;

use Illuminate\Database\Eloquent\Model;

class fournisseurs extends Model
{
    protected $table = 'fournisseurs';
    protected $primaryKey = 'id';

    protected $fillable = [
        'libelle_fournisseur',
        'image_fournisseur',
        'description',
        'updated_at'
    ];
}
