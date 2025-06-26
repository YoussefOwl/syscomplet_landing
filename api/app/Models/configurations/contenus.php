<?php

namespace App\Models\configurations;
use Illuminate\Database\Eloquent\Model;

class contenus extends Model
{
    protected $fillable = [
        'html_id',
        'description_fr',
        'description_ar',
        'page', // landing - about - contact - faq - terms - privacy...
        'page_position', // header - body - footer
        'class', // icon - bootstrap ...
        'image',
        'autre', // text - html - link
        'created_at',
        'updated_at'
    ];

    protected $table = 'contenus';
    protected $primaryKey = 'id';
}