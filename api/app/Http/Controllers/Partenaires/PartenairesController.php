<?php

namespace App\Http\Controllers\Partenaires;
use App\Http\Controllers\Controller;
use PHPUnit\Exception;
use App\Models\partenaires\partenaires;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB,Validator,Storage,File,Crypt};
use Illuminate\Database\QueryException;
use App\Models\helpers;
use Carbon\Carbon;

class PartenairesController extends Controller
{
    public function __construct() {}

    public function AfficherPartenaires(Request $request)
    {
        try
        {
            
            /* ------------------------------ les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? trim($request->post('colone')) : "libelle_partenaire";
            $order = $request->post('order') ? trim($request->post('order')) : "asc";
            $if_excel = $request->post('if_excel') ? true : false;
            /* ---------------------- les variables de la recherche --------------------- */
            $libelle_partenaire = $request->post('libelle_partenaire') ? trim($request->post('libelle_partenaire')) : null;
            $ice_partenaire = $request->post('ice_partenaire') ? trim($request->post('ice_partenaire')) : null;
            $email_partenaire = $request->post('email_partenaire') ? trim($request->post('email_partenaire')) : null;
            $id_ville = $request->post('id_ville') ? intval($request->post('id_ville')) : null;
            $autorisation_partenaire = $request->post('autorisation_partenaire') ? intval($request->post('autorisation_partenaire')) : null;

            /* ------------------------------- La requête ------------------------------- */
            $liste_partenaires = partenaires::leftJoin('villes','partenaires.id_ville','=','villes.id')
            ->select(
                'partenaires.*',
                'villes.libelle_ville',
            )
            ->whereNull('partenaires.deleted_at');

            /* -------------------------------------------------------------------------- */
            /*                        Les filitres de la recherche                        */
            /* -------------------------------------------------------------------------- */
            if($ice_partenaire)
            {
                $liste_partenaires = $liste_partenaires->where('partenaires.ice_partenaire', 'like', '%' . $ice_partenaire . '%');
            }
            if($email_partenaire)
            {
                $liste_partenaires = $liste_partenaires->where('partenaires.email_partenaire', 'like', '%' . $email_partenaire . '%');
            }
            if($libelle_partenaire)
            {
                $liste_partenaires = $liste_partenaires->where('partenaires.libelle_partenaire', 'like', '%' . $libelle_partenaire . '%');
            }
            if($id_ville)
            {
                $liste_partenaires = $liste_partenaires->where('partenaires.id_ville',$id_ville);
            }
            if($autorisation_partenaire)
            {
                $liste_partenaires = $liste_partenaires->where('partenaires.autorisation_partenaire',$autorisation_partenaire);
            }

            /* -------------------------------------------------------------------------- */
            /*                                 TRAITEMENTS                                */
            /* -------------------------------------------------------------------------- */

            $totalRecords = $liste_partenaires->count(); // Calcule du total
            $liste_partenaires = $if_excel
            ? $liste_partenaires->orderBy($colone,$order)->get()
            : $liste_partenaires->orderBy($colone,$order)->skip($skip)->take($take)->get();

            foreach ($liste_partenaires as $rec)
            {
                $rec['_id'] = Crypt::encryptString($rec['id']);
                $rec['created_at_formated'] = $rec['created_at'] ? Carbon::parse($rec['created_at'])->format('d-m-Y H:i') : null;
                $rec['updated_at_formated'] = $rec['updated_at'] ? Carbon::parse($rec['updated_at'])->format('d-m-Y H:i') : null;
                $rec['label_type_societe_partenaire'] = $rec['type_societe_partenaire'] ? helpers::GetLabels($rec['type_societe_partenaire'],'liste_type_societe') : null;
                $rec['label_autorisation_partenaire'] = $rec['autorisation_partenaire'] ? helpers::GetLabels($rec['autorisation_partenaire'],'liste_autorisations') : null;
                $rec['badge_autorisation_partenaire'] = $rec['autorisation_partenaire'] ? helpers::GetLabels($rec['autorisation_partenaire'],'liste_autorisations','badge') : null;
                unset($rec['id']);
            }

            return response()->json(
            [
                'api_message' => 'success',
                'totalRecords' => $totalRecords,
                'Data' => $liste_partenaires
            ], 200);
        }

        catch (Exception $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
        catch (QueryException $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
    }

    public function AfficherPartenaireFO()
    {
        try
        {
            /* ------------------------------- La requête ------------------------------- */
            $liste_partenaires = partenaires::leftJoin('villes','partenaires.id_ville','=','villes.id')
            ->select(
                'partenaires.libelle_partenaire',
                'partenaires.logo_partenaire',
                'villes.libelle_ville'
            )
            ->where('partenaires.autorisation_partenaire',1)
            ->whereNull('partenaires.deleted_at')
            ->get();

            return response()->json(
            [
                'api_message' => 'success',
                'Data' => $liste_partenaires
            ], 200);
        }

        catch (Exception $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
        catch (QueryException $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
    }

    public function AjouterPartenaire(Request $request)
    {
        try
        {
            
            $messages = [
                'libelle_partenaire' => 'required|min:3'
            ];

            $validator = Validator::make($request->all(),$messages,$messages);

            if ($validator->fails())
            {
                return response()->json(
                [
                    'api_message' => 'erreur_de_parametres',
                    'erreur' => $validator->errors()
                ], 200);
            }

            else
            {
                /* ------------------ Recherche si le partenaire est éxistant ----------------- */
                $libelle_partenaire = mb_convert_case(trim($request->post('libelle_partenaire')),MB_CASE_TITLE,"UTF-8");
                $ice_partenaire = $request->post('ice_partenaire') 
                ? preg_replace('/\s+/','',$request->post('ice_partenaire')) 
                : null;
                $email_partenaire = $request->post('email_partenaire') 
                ? preg_replace('/\s+/', '',mb_strtolower($request->post('email_partenaire'))) 
                : null;
                $telephone_partenaire = $request->post('telephone_partenaire') 
                ? preg_replace('/\s+/', '',$request->post('telephone_partenaire')) 
                : null;
                $Check_if_ice_partenaire_exsists = $ice_partenaire 
                ? $this->Check_if_ice_partenaire_exsists($ice_partenaire) 
                : false;

                if ($Check_if_ice_partenaire_exsists)
                {
                    return response()->json(
                    [
                        'api_message' => 'ice_existant'
                    ], 200);
                    exit();
                }

                /* -------------------------- Recherche si existant ------------------------- */
                $partenaire = DB::table('partenaires')
                ->where('libelle_partenaire',$libelle_partenaire)
                ->first();

                if ($partenaire) // Si le partenaire est existant
                {
                    if($partenaire->deleted_at!=null) // partenaire supprimé précédemment
                    {
                        return response()->json(
                        [
                            'api_message' => 'deleted',
                            'id_partenaire' => Crypt::encryptString($partenaire->id)
                        ], 200);  
                    }
                    else
                    {
                        return response()->json(
                        [
                            'api_message' => 'existant'
                        ], 200);  
                    }
                }
                else // Si le partenaire est non existant
                {
                    $query_ajouter = partenaires::create([
                        /* ---------------------------- Les champs requis --------------------------- */
                        'id_ville' => $request->post('id_ville') 
                        ? intval($request->post('id_ville')) 
                        : null,
                        'autorisation_partenaire' => $request->post('autorisation_partenaire') 
                        ? intval($request->post('autorisation_partenaire'))
                        :null,
                        'type_societe_partenaire' => $request->post('type_societe_partenaire') ? 
                        intval($request->post('type_societe_partenaire'))
                        :null,
                        'telephone_partenaire' => $telephone_partenaire,
                        'libelle_partenaire' => $libelle_partenaire,
                        'ice_partenaire' => $ice_partenaire,
                        'email_partenaire' => $email_partenaire,
                        /* -------------------------- les champs non requis ------------------------- */
                        'fax_partenaire' => $request->post('fax_partenaire') ? trim($request->post('fax_partenaire')) : null,
                        'registre_commerce_partenaire' => $request->post('registre_commerce_partenaire') ? trim($request->post('registre_commerce_partenaire')) : null,
                        'identifiant_fiscal_partenaire' => $request->post('identifiant_fiscal_partenaire') ? trim($request->post('identifiant_fiscal_partenaire')) : null,
                        'rib_partenaire' => $request->post('rib_partenaire') ? trim($request->post('rib_partenaire')) : null,
                        'adresse_partenaire' => $request->post('adresse_partenaire') ? trim($request->post('adresse_partenaire')) : null,
                        'responsable_nom_complet' => $request->post('responsable_nom_complet') ? trim($request->post('responsable_nom_complet')) : null,
                        'responsable_telephone' => $request->post('responsable_telephone') ? preg_replace('/\s+/', '',$request->post('responsable_telephone'))  : null,
                        'responsable_email' => $request->post('responsable_email') ? preg_replace('/\s+/', '',mb_strtolower($request->post('responsable_email'))) : null,
                        'description' => $request->post('description') ? trim($request->post('description')) : null,
                        'updated_at' => null
                    ]);

                    if($query_ajouter->save())
                    {
                        /* -------------------------------------------------------------------------- */
                        /*                                 LOG ACTION                                 */
                        /* -------------------------------------------------------------------------- */
                        $description_log = 'Ajout du partenaire qui a comme identifiant sur la base : '.$query_ajouter->id;
                        helpers::Log_action('partenaires',helpers::get_id_logger(),"Ajout d'un partenaire",$description_log,$request->all());
                        return response()->json(
                        [
                            'api_message' => 'ajouter'
                        ], 200);
                    }
                    else
                    {
                        return response()->json(
                        [
                            'api_message' => 'non_ajouter'
                        ], 200);
                    }
                }
            }
        }

        catch (Exception $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
        catch (QueryException $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
    }
    
    private function Check_if_ice_partenaire_exsists($ice_partenaire,$_id=null)
    {
        /* ------ Check si le  est déja sur la table partenaires ----- */
        $array_of_search = $_id 
        ?  array(['ice_partenaire', $ice_partenaire],['id','!=', $_id])
        :  array(['ice_partenaire', $ice_partenaire]);
        return partenaires::select('id')
        ->where($array_of_search)
        ->first() ? true : false;
    }

    public function SupprimerPartenaire(Request $request)
    {
        try
        {
            
            $messages = [
                'id_partenaire' => 'required'
            ];

            $validator = Validator::make($request->all(),$messages,$messages);

            if ($validator->fails())
            {
                return response()->json(
                    [
                        'api_message' => 'erreur_de_parametres',
                        'erreur' => $validator->errors()
                    ],200
                );
            }

            else
            {
                /* ----------------------- décryptage de l'identifiant ---------------------- */
                $id_partenaire = intval(Crypt::decryptString($request->post('id_partenaire')));

                /* ------------------------------- La requête ------------------------------- */
                $query_delete = DB::table('partenaires')
                    ->where('id',$id_partenaire)
                    ->update(array(
                    'deleted_at' =>date("Y-m-d H:i:s")
                ));

                if ($query_delete)
                {
                    $description_log = 'Suppression du partenaire qui a comme identifiant sur la base : '.$id_partenaire;
                    helpers::Log_action('partenaires',helpers::get_id_logger(),"Suppression de partenaire",$description_log,$request->all());
                }

                return response()->json(
                [
                    'api_message' => $query_delete ? 'supprimer' : 'non_supprimer'
                ],200);
            }
        }

        catch (Exception $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
        catch (QueryException $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
    }

    public function ModifierPartenaire(Request $request)
    {
        try
        {
            
            $messages = [
                '_id' => 'required',
                'libelle_partenaire' => 'required|min:3'
            ];

            $validator = Validator::make($request->all(),$messages,$messages);

            if ($validator->fails())
            {
                return response()->json(
                    [
                        'api_message' => 'erreur_de_parametres',
                        'erreur' => $validator->errors()
                    ],200
                );
            }

            else
            {
                /* ----------------------- décryptage des identifiants ---------------------- */
                $_id = intval(Crypt::decryptString($request->post('_id')));
                /* ---------------------- Récupération autres variables --------------------- */
                $libelle_partenaire = trim(mb_convert_case($request->post('libelle_partenaire'),MB_CASE_TITLE,"UTF-8"));
                $ice_partenaire = $request->post('ice_partenaire') 
                ? preg_replace('/\s+/','',$request->post('ice_partenaire')) 
                : null;
                $email_partenaire = $request->post('email_partenaire') 
                ? preg_replace('/\s+/', '',mb_strtolower($request->post('email_partenaire'))) 
                : null;
                $telephone_partenaire = $request->post('telephone_partenaire') 
                ? preg_replace('/\s+/', '',$request->post('telephone_partenaire')) 
                : null;

                $Check_if_ice_partenaire_exsists = $ice_partenaire 
                ? $this->Check_if_ice_partenaire_exsists($ice_partenaire,$_id) 
                : false;

                if ($Check_if_ice_partenaire_exsists)
                {
                    return response()->json(
                    [
                        'api_message' => 'ice_existant'
                    ], 200);
                    exit();
                }

                /* ------------------- Chercher duplicate tentative ------------------ */
                $if_dublicate_tentative = DB::table('partenaires')
                ->where(
                    [
                        ['libelle_partenaire',$libelle_partenaire],
                        ['id','!=',$_id]
                    ]
                )
                ->first();

                /* -------------------------- partenaire existant -------------------------- */
                if ($if_dublicate_tentative)
                {
                    if($if_dublicate_tentative->deleted_at!=null) // partenaire supprimé précédemment
                    {
                        return response()->json(
                        [
                            'api_message' => 'deleted',
                            'id_partenaire' => Crypt::encryptString($if_dublicate_tentative->id)
                        ], 200);  
                    }
                    else
                    {
                        return response()->json(
                        [
                            'api_message' => 'existant'
                        ], 200);  
                    }
                }

                /* ------------------------- Partenaire non exstant ------------------------ */
                else
                {
                    $query_update = DB::table('partenaires')
                    ->where('id',$_id)
                    ->update(
                        array(
                       /* ---------------------------- Les champs requis --------------------------- */
                        'id_ville' => $request->post('id_ville') 
                        ? intval($request->post('id_ville')) 
                        : null,
                        'autorisation_partenaire' => $request->post('autorisation_partenaire') 
                        ? intval($request->post('autorisation_partenaire'))
                        :null,
                        'type_societe_partenaire' => $request->post('type_societe_partenaire') ? 
                        intval($request->post('type_societe_partenaire'))
                        :null,
                        'telephone_partenaire' => $telephone_partenaire,
                        'libelle_partenaire' => $libelle_partenaire,
                        'ice_partenaire' => $ice_partenaire,
                        'email_partenaire' => $email_partenaire,
                        /* -------------------------- les champs non requis ------------------------- */
                        'registre_commerce_partenaire' => $request->post('registre_commerce_partenaire') ? trim($request->post('registre_commerce_partenaire')) : null,
                        'fax_partenaire' => $request->post('fax_partenaire') ? trim($request->post('fax_partenaire')) : null,
                        'identifiant_fiscal_partenaire' => $request->post('identifiant_fiscal_partenaire') ? trim($request->post('identifiant_fiscal_partenaire')) : null,
                        'rib_partenaire' => $request->post('rib_partenaire') ? trim($request->post('rib_partenaire')) : null,
                        'adresse_partenaire' => $request->post('adresse_partenaire') ? trim($request->post('adresse_partenaire')) : null,
                        'responsable_nom_complet' => $request->post('responsable_nom_complet') ? trim($request->post('responsable_nom_complet')) : null,
                        'responsable_telephone' => $request->post('responsable_telephone') ? preg_replace('/\s+/','',$request->post('responsable_telephone'))  : null,
                        'responsable_email' => $request->post('responsable_email') ? preg_replace('/\s+/', '',mb_strtolower($request->post('responsable_email'))) : null,
                        'description' => $request->post('description') ? trim($request->post('description')) : null,
                        'updated_at' => date("Y-m-d H:i:s")
                    ));

                    if ($query_update)
                    {
                        /* -------------------------------------------------------------------------- */
                        /*                                 LOG ACTION                                 */
                        /* -------------------------------------------------------------------------- */
                        $description_log = 'Modification des informations du partenaire qui a comme identifiant sur la base : '.$_id;
                        helpers::Log_action('partenaires',helpers::get_id_logger(),"Modification de partenaire",$description_log,$request->all());
                        return response()->json(
                        [
                            'api_message' => 'modifier'
                        ],200);
                    }
                    else
                    {
                        return response()->json(
                        [
                            'api_message' => 'non_modifier'
                        ],200);
                    }
                }
            }
        }

        catch (Exception $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
        catch (QueryException $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
    }

    public function RestaurerPartenaire(Request $request)
    {
        try
        {
            
            $messages = [
                'id_partenaire' => 'required'
            ];

            $validator = Validator::make($request->all(),$messages,$messages);

            if ($validator->fails())
            {
                return response()->json(
                    [
                        'api_message' => 'erreur_de_parametres',
                        'erreur' => $validator->errors()
                    ],200
                );
            }

            else
            {
                /* ----------------------- décryptage de l'identifiant ---------------------- */
                $id_partenaire = intval(Crypt::decryptString($request->post('id_partenaire')));

                /* ------------------------------- La requête ------------------------------- */
                $query_restaurer = DB::table('partenaires')
                ->where('id',$id_partenaire)
                ->update(array('deleted_at' => null));

                if ($query_restaurer)
                {
                    /* -------------------------------------------------------------------------- */
                    /*                                 LOG ACTION                                 */
                    /* -------------------------------------------------------------------------- */
                    $description_log = 'Restauration du partenaire qui a comme identifiant sur la base : '.$id_partenaire;
                    helpers::Log_action('partenaires',helpers::get_id_logger(),"Restauration de partenaire",$description_log,$request->all());
                    return response()->json(
                    [
                        'api_message' => 'success'
                    ],200);
                }
                else
                {
                    return response()->json(
                    [
                        'api_message' => 'non_restaurer'
                    ],200);
                }
            }
        }

        catch (Exception $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
        catch (QueryException $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
    }

    /* -------------------------------------------------------------------------- */
    /*             Les fonctions pour uploder le logo des partenaires            */
    /* -------------------------------------------------------------------------- */

    public function ModifierImagePartenaire(Request $request)
    {
        try
        {
            
            $messages = [
                'id_partenaire' => 'required'
            ];

            $validator = Validator::make($request->all(),$messages,$messages);

            if ($validator->fails() || !$request->hasFile('copie_image_partenaire'))
            {
                return response()->json(
                    [
                        'api_message' => 'erreur_de_parametres',
                        'erreur' => $validator->errors()
                    ],200
                );
            }

            else
            {
                /* ------------------------------- Décryptage ------------------------------- */
                $id_partenaire = intval(Crypt::decryptString($request->post('id_partenaire')));

                if($request->post('image_old')) // suppression de l'ancienne image du partenaire
                {
                    $old = storage_path('app/public/partenaires/'.trim($request->post('image_old')));

                    if(File::exists($old))
                    {
                        Storage::disk('public')->delete('partenaires/'.trim($request->post('image_old')));
                    }
                }

                /* --------------------------------- Upload --------------------------------- */

                $file = $request->file('copie_image_partenaire')->openFile();
                $content = $file->fread($file->getSize());
                $saved_file = date("Y_m_d_H_i_s_s")."_partenaire_id_".$id_partenaire.".".trim($request->post('extention_copie_image_partenaire'));

                if(helpers::moveFile('partenaires/'.$saved_file, $content,'public'))
                {
                    $query_update_image = DB::table('partenaires')
                    ->where('id',$id_partenaire)
                    ->update(array(
                        'updated_at' => date("Y-m-d H:i:s"),
                        'logo_partenaire' => $saved_file
                    ));

                    if ($query_update_image)
                    {
                        return response()->json(
                        [
                            'api_message' => 'success'
                        ], 200);
                    }
                    else
                    {
                        return response()->json(
                        [
                            'api_message' => 'erreur',
                            'erreur' => 'Erreur mise à jour'
                        ],200);
                    }
                }
                else
                {
                    return response()->json(
                    [
                        'api_message' => 'erreur',
                        'erreur' => 'Erreur upload'
                    ],200);
                }
            }
        }

        catch (Exception $error)
        {
           return response()->json(
           [
               'api_message' => 'erreur',
               'erreur' => $error
           ], 200);
        }
       catch (QueryException $error)
       {
           return response()->json(
           [
               'api_message' => 'erreur',
               'erreur' => $error
           ], 200);
        }
    }

    public function SupprimerImagePartenaire(Request $request)
    {
        try
        {
            
            $messages = [
                'id_partenaire' => 'required',
                'logo_partenaire' => 'required'
            ];

            $validator = Validator::make($request->all(),$messages,$messages);

            if ($validator->fails())
            {
                return response()->json(
                    [
                        'api_message' => 'erreur_de_parametres',
                        'erreur' => $validator->errors()
                    ],200
                );
            }

            else
            {
                /* ------------------------------- Décryptage ------------------------------- */
                $id_partenaire = intval(Crypt::decryptString($request->post('id_partenaire')));

                /* -------------------- Suppression du fichier de l'image ------------------- */
                $old = storage_path('app/public/partenaires/'.$request->post('logo_partenaire'));
                if(File::exists($old))
                {
                    Storage::disk('public')->delete('partenaires/'.$request->post('logo_partenaire'));
                }

                $query_delete = DB::table('partenaires')
                ->where('id', '=', $id_partenaire)
                ->update(array(
                    'updated_at' => date("Y-m-d H:i:s"),
                    'logo_partenaire' => null
                ));

                if ($query_delete)
                {
                    return response()->json(
                    [
                        'api_message' => 'success'
                    ], 200);
                }

                else
                {
                    return response()->json(
                    [
                        'api_message' => 'erreur',
                        'erreur' => 'Erreur mise à jour'
                    ], 200);
                }
            }
        }

        catch (Exception $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
        catch (QueryException $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
    }
}
?>