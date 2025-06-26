<?php

namespace App\Models\contacts;
use Illuminate\Database\Eloquent\Model;

class contacts extends Model
{
    protected $fillable = [
        'sujet_contact',
        'status_contact',
        'email_contact',
        'first_and_last_name',
        'adresse_ip',
        'date_contact',
        'message_contact',
        'created_at',
        'updated_at'
    ];
    protected $table = 'contacts';
    protected $primaryKey = 'id';
}
