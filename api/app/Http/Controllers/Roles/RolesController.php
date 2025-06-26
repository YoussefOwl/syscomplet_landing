<?php

namespace App\Http\Controllers\Roles;
use App\Http\Controllers\Controller;
use PHPUnit\Exception;
use App\Models\users\roles;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Validator,DB,Crypt};
use Carbon\Carbon;
use App\Models\helpers;

class RolesController extends Controller
{
    public function __construct() {}

    public function AjouterRole(Request $request)
    {
        try
        {
            
            $messages = [
                'libelle_role' => 'required|min:3',
                "sidebar" => 'required',
                'acronym_role' => 'required'
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
                $libelle_role = trim($request->post('libelle_role'));
                $sidebar = $request->post('sidebar');
                $acronym_role = trim($request->post('acronym_role'));
                
                // Chercher si le role est existant
                $deuplicate = DB::table('roles')
                ->where('libelle_role', mb_strtolower($libelle_role))
                ->orWhere('libelle_role', mb_strtoupper($libelle_role))
                ->orWhere('acronym_role',$acronym_role)
                ->first();

                if($deuplicate) 
                {
                    return response()->json(
                    [
                        'api_message' => 'existant'
                    ], 200);
                } 

                else 
                {
                    $query_ajouter = roles::create([
                        'libelle_role' => $libelle_role,
                        'acronym_role' => $acronym_role,
                        'sidebar' => $sidebar,
                        'description' => $request->post('description') ? trim($request->post('description')) : null
                    ]);

                    $if_saved = $query_ajouter->save();

                    if($if_saved) 
                    {
                        /* -------------------------------------------------------------------------- */
                        /*                                 LOG ACTION                                 */
                        /* -------------------------------------------------------------------------- */
                        $description_log = 'Création du role qui a comme identifiant : '.$query_ajouter->id;
                        helpers::Log_action('roles',helpers::get_id_logger(),"Création d'un nouveau rôle",$description_log,$request->all());
                    }
                    return response()->json(
                    [
                        'api_message' => $if_saved ? 'ajouter' : 'non_ajouter'
                    ], 200);
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

    public function AfficherRole(Request $request)
    {
        try
        {
            
            /* ------------------------------ Les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "libelle_role";
            $order = $request->post('order') ? $request->post('order') : "asc";
            $if_excel = $request->post('if_excel') ? $request->post('if_excel') : null;
            $libelle_role = $request->post('libelle_role') ? trim($request->post('libelle_role')) : null;
            $description = $request->post('description') ? trim($request->post('description')) : null;
            $acronym_role = $request->post('acronym_role') ? trim($request->post('acronym_role')) : null;
            $sidebar = $request->post('sidebar') ? trim($request->post('sidebar')) : null;

            /* ----------------------- La requête de récupération ----------------------- */
            $listes_roles = roles::select('roles.*');

            if($libelle_role)
            {
                $listes_roles = $listes_roles->where('libelle_role', 'like', '%' . $libelle_role . '%');
            }
            if($description)
            {
                $listes_roles = $listes_roles->where('description', 'like', '%' . $description . '%');
            }
            if($acronym_role)
            {
                $listes_roles = $listes_roles->where('acronym_role', 'like', '%' . $acronym_role . '%');
            }
            if($sidebar)
            {
                $listes_roles = $listes_roles->where('sidebar', 'like', '%' . $sidebar . '%');
            }
    
            $totalRecords = $listes_roles->count(); // le total

            /* ------------------------------ Finalisation ------------------------------ */
            $listes_roles = $if_excel
            ? $listes_roles->orderBy($colone,$order)->get()
            : $listes_roles->orderBy($colone,$order)->skip($skip)->take($take)->get();

            /* -------------------------------------------------------------------------- */
            /*                           Traitement des données                           */
            /* -------------------------------------------------------------------------- */

            foreach ($listes_roles as $rec) 
            {
                $rec['_id'] = Crypt::encryptString($rec['id']);
                $rec['id_base64_encode'] = base64_encode($rec['id']);
                $rec['id_md5_base64_encode'] = md5(base64_encode($rec['id']));
                $rec['sidebar'] = json_decode($rec['sidebar']);
                $rec['created_at_formated'] = $rec['created_at'] ? Carbon::parse($rec['created_at'])->format('d-m-Y H:i') : null;
                $rec['updated_at_formated'] = $rec['updated_at'] ? Carbon::parse($rec['updated_at'])->format('d-m-Y H:i') : null;
            }

            return response()->json(
            [
                'api_message' =>'success',
                'totalRecords' => $totalRecords,
                'Data' => $listes_roles
            ], 200)->header('Content', 'application/json');
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

    public function ModifierRole(Request $request)
    {
        try
        {
            
            $messages = [
                '_id' => 'required',
                'libelle_role' => 'required',
                'sidebar' => 'required',
                'acronym_role' => 'required'
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
                $libelle_role = trim($request->post('libelle_role'));
                $acronym_role = trim($request->post('acronym_role'));
                $sidebar = $request->post('sidebar');

                /* -------------------------------------------------------------------------- */
                /*                           Recherche si ça existe                           */
                /* -------------------------------------------------------------------------- */

                $if_dublicate_tentative = DB::table('roles')
                ->where([
                    ['libelle_role',mb_strtolower($libelle_role)],
                    ['id','!=',$_id]
                ])
                ->orWhere([
                    ['libelle_role',mb_strtoupper($libelle_role)],
                    ['id','!=',$_id]
                ])
                ->orWhere([
                    ['acronym_role',$acronym_role],
                    ['id','!=',$_id]
                ])
                ->first();

                if ($if_dublicate_tentative)
                {
                    return response()->json(
                    [
                        'api_message' => 'existant'
                    ], 200);
                }

                else
                {
                    /* ----------------------- La requête de modification ----------------------- */
                    $query_update = DB::table('roles')
                    ->where('id',$_id)
                    ->update(
                        array(
                        'updated_at' => date("Y-m-d H:i:s"),
                        'libelle_role' => $libelle_role,
                        'acronym_role' => $acronym_role,
                        'sidebar' => $sidebar,
                        'description' => $request->post('description') ? trim($request->post('description')) : null
                    ));
        
                    if ($query_update)
                    {
                        /* -------------------------------------------------------------------------- */
                        /*                                 LOG ACTION                                 */
                        /* -------------------------------------------------------------------------- */
                        $description_log = 'Modification du rôle qui a comme identifiant : '.$_id;
                        helpers::Log_action('roles',helpers::get_id_logger(),"Modification d'un rôle",$description_log,$request->all());
                    }
        
                    return response()->json(
                    [
                        'api_message' => $query_update ? 'modifier' : 'non_modifier'
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

}