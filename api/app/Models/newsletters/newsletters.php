<?php

namespace App\Models\newsletters;
use Illuminate\Database\Eloquent\Model;

class newsletters extends Model
{
    protected $fillable = [
        'email_newsletter',
        'adresse_ip',
        'created_at',
        'updated_at'
    ];
    protected $table = 'newsletters';
    protected $primaryKey = 'id';
}
