<?php

namespace App\Http\Controllers\General;
use PHPUnit\Exception;
use Carbon\Carbon;
use stdClass;
use App\Models\helpers;
use Illuminate\Support\Facades\{Validator,File,DB,Crypt};
use Illuminate\Database\QueryException;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\users\{User,roles,actions_logs};
use App\Models\partenaires\partenaires;
use App\Models\configurations\villes;

class GeneralController extends Controller
{
    /* ----------------------------- Load des listes ---------------------------- */
    public function LoadParamsForList(Request $request)
    {
        try
        {
            
            /* ------------------------- Création des variables ------------------------- */
            $results = new stdClass();

            /* ---------------------------- les utilisateurs ---------------------------- */
            if($request->post('users'))
            {
                $results->liste_users = User::select(
                    'users.id',
                    DB::raw('CONCAT(users.nom, " ", users.prenom) AS nom_complet')
                )
                ->whereNull('deleted_at')
                ->orderBy("nom","asc")
                ->get();
            }

            /* ------------------------------- les villes ------------------------------- */
            if($request->post('villes'))
            {
                $results->liste_villes = villes::select(
                    'villes.id',
                    'villes.libelle_ville'
                )
                ->whereNull('villes.deleted_at')
                ->orderBy("libelle_ville","asc")
                ->get();
            }

            /* -------------------------------- les roles ------------------------------- */
            if($request->post('roles'))
            {
                $liste_roles = roles::select(
                    'roles.id',
                    'roles.libelle_role'
                );

                /* ------------------- Dynamisation de la liste des rôles ------------------- */

                if(!in_array(helpers::get_id_role_base_64_md5(),helpers::getRoleValue('group_roles_can_add_users_admins')))
                {
                    $liste_roles = $liste_roles->where('id','!=',intval(env('identifiant_role_admin')));
                }

                $results->liste_roles = $liste_roles->orderBy("libelle_role","asc")->get();
            }

            /* ---------------------------- Les partenaires ---------------------------- */
            if($request->post('partenaires'))
            {
                $results->liste_partenaires = partenaires::select(
                    'partenaires.id',
                    'partenaires.libelle_partenaire'
                )
                ->whereNull('partenaires.deleted_at')
                ->orderBy("libelle_partenaire","asc")
                ->get();
            }

            /* ---------------------------------- tables ---------------------------------- */
            if($request->post('tables'))
            {
                $liste_tables = DB::select('SHOW TABLES');
                $results->liste_tables = helpers::map_list_single_key($liste_tables,'Tables_in_'.env("DB_DATABASE"));
            }

            /* ---------------------------------- pages --------------------------------- */
            if($request->post('pages'))
            {
                $results->liste_pages = config('config_arrays.liste_pages'); 
            }
            
            /* ------------------------------ page position ----------------------------- */
            if($request->post('page_positions'))
            {
                $results->liste_page_positions = config('config_arrays.liste_page_positions'); 
            }

            /* ------------------------- On retourne le resulat ------------------------- */
            $results->api_message = "success";
            return response()->json($results, 200);
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

    public function TelechargerDocument(Request $request)
    {
        try
        {
            
            /* ------------------------------- Validation ------------------------------- */
            $messages = [
                'fileName' => 'required',
                'from' => 'required'
            ];
            
            $validator = Validator::make($request->all(),$messages,$messages);

            if ($validator->fails()) // Si la validation n'a pas réussie
            { 
                return response()->json(
                [
                    'api_message' => 'erreur_de_parametres',
                    'erreur' => $validator->errors()
                ], 200);
            } 

            else
            {
                $source = $request->post('source') ? $request->post('source') : "private";
                $file = storage_path('app/'.$source.'/'.$request->post('from').'/'.$request->post('fileName'));

                if(File::exists($file))
                {
                    return response()->download(storage_path("app/".$source."/".$request->post('from').'/'.$request->post('fileName')));
                }
                else
                {
                    return response()->json(
                    [
                        'api_message' => 'fichier_inexistant'
                    ], 200);
                }
            }
        }

        catch(QueryException $error)
        {
            return response()->json(
            [
                'api_message' => 'fichier_inexistant',
                'erreur' => $error
            ], 200);
        }
    }

    public function AfficherLogs(Request $request)
    {
        try
        {
            
            /* ------------------------------ les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "created_at";
            $order = $request->post('order') ? $request->post('order') : "desc";
            $debut = $request->post('debut') ? $request->post('debut') : null;
            $fin = $request->post('fin') ? $request->post('fin') : null;
            $if_excel = $request->post('if_excel') ? true : false;
            $id_user = $request->post('id_user') ? intval($request->post('id_user')) : null;
            $description = $request->post('description') ? trim($request->post('description')) : null;
            $libelle_log = $request->post('libelle_log') ? trim($request->post('libelle_log')) : null;
            $json_log_data = $request->post('json_log_data') ? trim($request->post('json_log_data')) : null;
            $table_name = $request->post('table_name') ? (array)$request->post('table_name') : null;

            /* -------------------------- La requète du select -------------------------- */
            $Liste_logs = actions_logs::join('users', 'actions_logs.id_user', '=', 'users.id')
            ->select(
                'actions_logs.*',
                'users.nom',
                'users.prenom'
            );

            /* -------------------------------------------------------------------------- */
            /*                                La recherche                                */
            /* -------------------------------------------------------------------------- */
            if($description)
            {
                $Liste_logs = $Liste_logs->where('actions_logs.description', 'like', '%' . $description . '%');
            }
            if($json_log_data)
            {
                $Liste_logs = $Liste_logs->where('actions_logs.json_log_data', 'like', '%' . $json_log_data . '%');
            }
            if($libelle_log)
            {
                $Liste_logs = $Liste_logs->where('actions_logs.libelle_log', 'like', '%' . $libelle_log . '%');
            }
            if($debut)
            {
                $Liste_logs = $Liste_logs->whereDate('actions_logs.created_at','>=',$debut);
            }
            if($fin)
            {
                $Liste_logs = $Liste_logs->whereDate('actions_logs.created_at','<=',$fin);
            }
            if($id_user)
            {
                $Liste_logs = $Liste_logs->where('actions_logs.id_user',$id_user);
            }
            if($table_name)
            {
                $Liste_logs = $Liste_logs->whereIn('actions_logs.table_name',$table_name);
            }

            $totalRecords = $Liste_logs->count(); // le total

            /* ------------------------------ Finalisation ------------------------------ */

            $Liste_logs = $if_excel
            ? $Liste_logs->orderBy($colone,$order)->get()
            : $Liste_logs->orderBy($colone,$order)->skip($skip)->take($take)->get();

            /* ------------------------------- Traitements ------------------------------ */

            foreach ($Liste_logs as $log)
            {
                $log['_id'] = Crypt::encryptString($log['id']);
                $log['nom_complet'] = $log['nom'].' '.$log['prenom'];
                $log['json_log_data'] = $log['json_log_data'] ? json_decode($log['json_log_data']) : null;
                $log['created_at_formated'] = $log['created_at'] ? Carbon::parse($log['created_at'])->format('d-m-Y H:i') : null;
                $log['updated_at_formated'] = $log['updated_at'] ? Carbon::parse($log['updated_at'])->format('d-m-Y H:i') : null;
                unset($log['id']);
            }

            /* ------------------------- On renvoie le résultat ------------------------- */
            return response()->json(
            [
                'api_message' => 'success',
                'totalRecords' => $totalRecords,
                'Data' => $Liste_logs
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
           return helpers::apiResponse('erreur',null,$error);
        }
    }
}
?>