<?php

namespace App\Models\contacts;

use Illuminate\Database\Eloquent\Model;

class demande_demo extends Model
{
    protected $fillable = [
        "nom_demandeur",
        "email_demandeur",
        "phone_demandeur",
        "entreprise_demandeur",
        "message_demandeur",
    ];
    protected $table = 'demande_demo';
}
