<?php

namespace App\Models\partenaires;
use Illuminate\Database\Eloquent\Model;

class partenaires extends Model
{
    protected $fillable = [
        'id_ville',
        'autorisation_partenaire',
        'type_societe_partenaire',
        'libelle_partenaire',
        'telephone_partenaire',
        'email_partenaire',
        'ice_partenaire',
        'fax_partenaire',
        'registre_commerce_partenaire',
        'identifiant_fiscal_partenaire',
        'rib_partenaire',
        'adresse_partenaire',
        'description',
        'responsable_nom_complet',
        'responsable_telephone',
        'responsable_email',
        'logo_partenaire',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $table = 'partenaires';
    protected $primaryKey = 'id';
}
