<?php

namespace App\Models\articles;

use Illuminate\Database\Eloquent\Model;

class articles extends Model
{
    protected $fillable = [
        'libelle_article',
        'image',
        'description',
    ];
    protected $table = 'articles';
}
