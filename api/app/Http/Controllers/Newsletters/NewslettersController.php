<?php

namespace App\Http\Controllers\Newsletters;
use App\Http\Controllers\Controller;
use PHPUnit\Exception;
use App\Models\newsletters\newsletters;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB,Crypt,Validator};
use Illuminate\Database\QueryException;
use App\Models\helpers;
use Carbon\Carbon;

class NewslettersController extends Controller
{
    public function __construct() {}

    public function AjouterNewsletter(Request $request)
    {
        try
        {
            $messages = [
                'email_newsletter' => 'required|email|min:3|max:200|unique:newsletters'
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
                /* ----------------------- Récupération des variables ----------------------- */
                $email_newsletter = trim($request->post('email_newsletter'));
                $create_array = [
                    'email_newsletter' => $email_newsletter,
                    'adresse_ip' => $_SERVER['REMOTE_ADDR'],
                    'updated_at' => null
                ];
                $query_ajouter = newsletters::create($create_array);
                return response()->json(
                [
                    'api_message' => $query_ajouter->save() ? 'ajouter' : 'non_ajouter',
                ], 200);
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

    public function AfficherNewslettersAdmins(Request $request)
    {
        try
        {
            
            /* ------------------------------ les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "email_newsletter";
            $order = $request->post('order') ? $request->post('order') : "asc";
            $if_excel = $request->post('if_excel') ? true : false;
           /* ---------------------- Variables de la recherche --------------------- */
            $searchFields = [
                'email_newsletter' => 'trim',
                'adresse_ip' => 'trim'
            ];
            $searchValues = [];
            foreach ($searchFields as $field => $function) {
                $value = $request->post($field);
                $searchValues[$field] = $value ? $function($value) : null;
            }

            /* ------------------------------- La requête ------------------------------- */
            $liste_newsletters = newsletters::select('newsletters.*');

            /* -------------------------------------------------------------------------- */
            /*                         Les filtres de la recherche                        */
            /* -------------------------------------------------------------------------- */

            foreach ($searchValues as $field => $value) {
                if ($value !== null) {
                    // For partial matches like email, names, IP address, etc.
                    $liste_newsletters = $liste_newsletters->where('newsletters.'.$field, 'like', '%' . $value . '%');
                }
            }

            /* -------------------------------------------------------------------------- */
            /*                                 TRAITEMENTS                                */
            /* -------------------------------------------------------------------------- */

            $totalRecords = $liste_newsletters->count(); // le total

            $liste_newsletters = $if_excel
            ? $liste_newsletters->orderBy($colone,$order)->get()
            : $liste_newsletters->orderBy($colone,$order)->skip($skip)->take($take)->get();

            foreach ($liste_newsletters as $rec)
            {
                $rec['_id'] = Crypt::encryptString($rec['id']);
                $rec['base_id'] = 'NEWS_'.$rec['id'];
                $rec['created_at_formated'] = $rec['created_at'] ? Carbon::parse($rec['created_at'])->format('d-m-Y H:i') : null;
                unset($rec['id']);
            }

            return response()->json(
            [
                'api_message' => 'success',
                'totalRecords' => $totalRecords,
                'Data' => $liste_newsletters
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

    public function SupprimerNewsletter(Request $request)
    {
        try
        {
            
            $messages = [ 'id_newsletter' => 'required'];

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
                $id_newsletter = intval(Crypt::decryptString($request->post('id_newsletter')));
                $newsletter = newsletters::find($id_newsletter);

                /* ------------------------------- La requête ------------------------------- */
                $query_delete = DB::table('newsletters')
                ->where('id',$id_newsletter)
                ->delete();

                if ($query_delete)
                {
                    $description_log = 'Suppression du newsletter qui a comme identifiant sur la base : '.$id_newsletter;
                    helpers::Log_action('newsletters',helpers::get_id_logger(),"Suppression de newsletter",$description_log,
                        array(
                            'newsletter' => $newsletter
                        )
                    );
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
}
