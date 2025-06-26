<?php

namespace App\Http\Controllers\Villes;
use App\Http\Controllers\Controller;
use PHPUnit\Exception;
use Illuminate\Support\Facades\{Crypt,DB,Validator};
use App\Models\configurations\villes;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\helpers;

class VillesController extends Controller
{
    public function __construct() {}

    public function AjouterVille(Request $request)
    {
        try
        {
            
            $messages = [
                'libelle_ville' => 'required|min:2'
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
                /* ------------------------------ les variables ----------------------------- */
                $libelle_ville = trim($request->post('libelle_ville'));

                // Chercher si la ville est existante
                $ville_exists = DB::table('villes')
                ->where('libelle_ville', mb_strtolower($libelle_ville))
                ->orWhere('libelle_ville', mb_strtoupper($libelle_ville))
                ->first();

                if($ville_exists) 
                {
                    if($ville_exists->deleted_at!=null) // ville supprimée précédemment
                    {
                        return response()->json(
                        [
                            'api_message' => 'deleted',
                            'id_ville' => Crypt::encryptString($ville_exists->id)
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

                else 
                {
                    $query_ajouter = villes::create([
                        'libelle_ville' => $libelle_ville,
                        'description' => $request->post('description') ? trim($request->post('description')) : null
                    ]);

                    if($query_ajouter->save()) 
                    {
                        helpers::Log_action('villes',helpers::get_id_logger(),"Création d'une nouvelle ville",null,$request->all());
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
        } // fin try

        catch (Exception $error) 
        {
           return helpers::apiResponse('erreur',null,$error);
        } 
        catch (QueryException $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
    }

    public function AfficherVille(Request $request)
    {
        try
        {
            
            /* ------------------------------ les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "libelle_ville";
            $order = $request->post('order') ? $request->post('order') : "asc";

            /* -------------------------- La requète du select -------------------------- */
            $liste_villes = villes::select('villes.*')->whereNull('deleted_at');

            $totalRecords = $liste_villes->count(); // le total

            /* ----------------------- Finalisation de la requête ----------------------- */
            $liste_villes = $liste_villes
            ->orderBy($colone,$order)
            ->skip($skip)->take($take)
            ->get();

            foreach ($liste_villes as $rec) 
            {
                $rec['_id'] = Crypt::encryptString($rec['id']);
                $rec['created_at_formated'] = $rec['created_at'] ? Carbon::parse($rec['created_at'])->format('d-m-Y H:i') : null;
                $rec['updated_at_formated'] = $rec['updated_at'] ? Carbon::parse($rec['updated_at'])->format('d-m-Y H:i') : null;
            }

            /* ------------------------- On renvoie le résultat ------------------------- */
            return response()->json(
            [
                'api_message' => 'success',
                'totalRecords' => $totalRecords,
                'Data' => $liste_villes
            ], 200);
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
    
    public function SupprimerVille(Request $request)
    {
        try
        {
            
            $messages = [
                '_id' => 'required'
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
                /* -------------------- Indentifiant de la ville en question -------------------- */
                $_id = intval(Crypt::decryptString(trim($request->post('_id'))));

                /* ---------------------------- CHECK IF RELATED ---------------------------- */
                $partenaires = DB::table('partenaires')->where('id_ville',$_id);

                if($partenaires->count()>0)
                {
                    return response()->json(
                    [
                        'api_message' => 'has_records',
                        'related_records' => [
                            'partenaires' => $partenaires->get()
                        ]
                    ],200);
                }

                else
                {
                    /* ------------------------ La requête de suppression ----------------------- */
                    $query_delete = DB::table('villes')
                    ->where('id',$_id)
                    ->update(array(
                        'deleted_at' => date("Y-m-d H:i:s")
                    ));
    
                    /* --------------------------- Retour du résultat --------------------------- */
                    if($query_delete)
                    {
                        helpers::Log_action('villes',helpers::get_id_logger(),"Suppression d'une ville",null,$request->all());
                    }
                    return response()->json(
                    [
                        'api_message' => $query_delete ? 'supprimer' : 'non_supprimer'
                    ],200)->header('Content', 'application/json');
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

    public function ModifierVille(Request $request)
    {
        try
        {
            
            $messages = [
                '_id' => 'required',
                'libelle_ville' => 'required'
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
                /* ------------------------------ les variables ----------------------------- */
                $_id = intval(Crypt::decryptString(trim($request->post('_id'))));
                $libelle_ville = trim($request->post('libelle_ville'));

                /* -------------------------------------------------------------------------- */
                /*                           Recherche si ça existe                           */
                /* -------------------------------------------------------------------------- */

                $if_dublicate_tentative = DB::table('villes')
                ->where([
                    ['libelle_ville',mb_strtolower($libelle_ville)],
                    ['id','!=',$_id]
                ])
                ->orWhere([
                    ['libelle_ville',mb_strtoupper($libelle_ville)],
                    ['id','!=',$_id]
                ])
                ->first();

                if ($if_dublicate_tentative)
                {
                    if($if_dublicate_tentative->deleted_at!=null) // ville supprimé précédemment
                    {
                        return response()->json(
                        [
                            'api_message' => 'deleted',
                            'id_ville' => Crypt::encryptString($if_dublicate_tentative->id)
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

                else
                {
                    /* ----------------------- La requête de modification ----------------------- */
                    $query_update = DB::table('villes')
                    ->where('id',$_id)
                    ->update(
                        array(
                        'updated_at' => date("Y-m-d H:i:s"),
                        'libelle_ville' => $libelle_ville,
                        'description' => $request->post('description') ? trim($request->post('description')) : null
                    ));
        
                    if ($query_update)
                    {
                        helpers::Log_action('villes',helpers::get_id_logger(),"Modification d'une ville",null,$request->all());
                    }
        
                    return response()->json(
                    [
                        'api_message' => $query_update ? 'modifier' : 'non_modifier'
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
           return helpers::apiResponse('erreur',null,$error);
        }
    }

    public function RestaurerVille(Request $request)
    {
        try
        {
            
            $messages = [
                'id_ville' => 'required'
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
                $id_ville = intval(Crypt::decryptString(trim($request->post('id_ville'))));

                /* ------------------------------- La requête ------------------------------- */
                $query_restaure = DB::table('villes')
                ->where('id',$id_ville)
                ->update(array('deleted_at' => null));

                if ($query_restaure)
                {
                    helpers::Log_action('villes',helpers::get_id_logger(),"Restauration d'une ville",null,$request->all());
                    
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
}