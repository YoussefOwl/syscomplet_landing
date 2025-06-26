<?php

namespace App\Http\Controllers\Contacts;
use App\Http\Controllers\Controller;
use PHPUnit\Exception;
use App\Models\contacts\contacts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB,Crypt, Validator};
use Illuminate\Database\QueryException;
use App\Models\helpers;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

class ContactsController extends Controller
{
    public function __construct() {}

    public function AjouterContact(Request $request)
    {
        try
        {
            $messages = [
                'sujet_contact'  => [
                    'required',
                    Rule::in(helpers::map_list_single_key(config('config_arrays')['liste_sujet_contact'],'value'))
                ],
                'email_contact' => 'required|email|min:3|max:200',
                'first_and_last_name' => 'required|min:3|max:100',
                'message_contact' => 'required|min:10|max:2000'
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
                $sujet_contact = intval($request->post('sujet_contact'));
                $email_contact = trim($request->post('email_contact'));
                $first_and_last_name = trim($request->post('first_and_last_name'));
                $message_contact = trim($request->post('message_contact'));
                $create_array = [
                    'sujet_contact' => $sujet_contact,
                    'email_contact' => $email_contact,
                    'first_and_last_name' => $first_and_last_name,
                    'message_contact' => $message_contact,
                    'date_contact' => date("Y-m-d"),
                    'adresse_ip' => $_SERVER['REMOTE_ADDR'],
                    'updated_at' => null
                ];
                $query_ajouter = contacts::create($create_array);
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

    public function AfficherContactsSubjects()
    {
        try
        {
            return response()->json(
            [
                'api_message' => 'success',
                'Data' => config('config_arrays')["liste_sujet_contact"] // list des sujets
            ], 200);
        }

        catch (Exception $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
    }

    public function AfficherContactsAdmins(Request $request)
    {
        try
        {
            /* ------------------------------ les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "sujet_contact";
            $order = $request->post('order') ? $request->post('order') : "asc";
            $if_excel = $request->post('if_excel') ? true : false;
            $debut = $request->post('debut') ? $request->post('debut') : null;
            $fin = $request->post('fin') ? $request->post('fin') : null;
           /* ---------------------- Variables de la recherche --------------------- */
            $searchFields = [
                'sujet_contact' => 'intval',
                'status_contact' => 'intval',
                'email_contact' => 'trim',
                'first_and_last_name' => 'trim',
                'adresse_ip' => 'trim',
                'message_contact' => 'trim'
            ];
            $searchValues = [];
            foreach ($searchFields as $field => $function) {
                $value = $request->post($field);
                $searchValues[$field] = $value ? $function($value) : null;
            }

            /* ------------------------------- La requête ------------------------------- */
            $liste_contacts = contacts::select('contacts.*');

            /* -------------------------------------------------------------------------- */
            /*                         Les filtres de la recherche                        */
            /* -------------------------------------------------------------------------- */

            foreach ($searchValues as $field => $value) {
                if ($value !== null) {
                    if (in_array($field, ['sujet_contact', 'status_contact'])) {
                        // Assuming these are exact value matches
                        $liste_contacts = $liste_contacts->where('contacts.'.$field, $value);
                    } else {
                        // For partial matches like email, names, IP address, etc.
                        $liste_contacts = $liste_contacts->where('contacts.'.$field, 'like', '%' . $value . '%');
                    }
                }
            }

            if($debut) {$liste_contacts = $liste_contacts->whereDate('contacts.date_contact','>=',$debut);}
            if($fin) {$liste_contacts = $liste_contacts->whereDate('contacts.date_contact','<=',$fin);}
            
            /* -------------------------------------------------------------------------- */
            /*                                 TRAITEMENTS                                */
            /* -------------------------------------------------------------------------- */

            $totalRecords = $liste_contacts->count(); // le total

            $liste_contacts = $if_excel
            ? $liste_contacts->orderBy($colone,$order)->get()
            : $liste_contacts->orderBy($colone,$order)->skip($skip)->take($take)->get();

            foreach ($liste_contacts as $rec)
            {
                $rec['_id'] = Crypt::encryptString($rec['id']);
                $rec['base_id'] = 'CNT_'.$rec['id'];
                /* ----------------------------- status_contact ----------------------------- */
                $rec['label_status_contact'] = helpers::GetLabels($rec['status_contact'],'liste_status_contact');
                $rec['badge_status_contact'] = helpers::GetLabels($rec['status_contact'],'liste_status_contact',"badge");
                $rec['is_finished'] = helpers::GetLabels($rec['status_contact'],'liste_status_contact',"is_finished");
                /* ---------------------------------- sujet --------------------------------- */
                $rec['label_sujet_contact'] = helpers::GetLabels($rec['sujet_contact'],'liste_sujet_contact');
                $rec['created_at_formated'] = $rec['created_at'] ? Carbon::parse($rec['created_at'])->format('d-m-Y H:i') : null;
                $rec['date_contact_formated'] = Carbon::parse($rec['date_contact'])->format('d-m-Y');
                $rec['updated_at_formated'] = $rec['updated_at'] ? Carbon::parse($rec['updated_at'])->format('d-m-Y H:i') : null;
                unset($rec['id']);
            }

            return response()->json(
            [
                'api_message' => 'success',
                'totalRecords' => $totalRecords,
                'Data' => $liste_contacts
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

    public function ModifierContacts(Request $request)
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
                /* ---------------------- Récupération variables --------------------- */
                $_id = intval(Crypt::decryptString($request->post('_id')));
                $status_contact = contacts::where('id',$_id)->value('status_contact');

                /* ----------------------------- Update requeste ---------------------------- */
                $query_update = DB::table('contacts')
                ->where('id',$_id)
                ->update(
                    array(
                    'status_contact' => $status_contact == 1 ? 2 : 1,
                    'updated_at' => date("Y-m-d H:i:s")
                ));

                if ($query_update)
                {
                    /* -------------------------------------------------------------------------- */
                    /*                                 LOG ACTION                                 */
                    /* -------------------------------------------------------------------------- */
                    $description_log = 'Modification d\'état d\'une demande de contact qui a comme identifiant sur la base : '.$_id;
                    helpers::Log_action('contacts',helpers::get_id_logger(),"Modification d'une demande de contact",$description_log,$request->all());
                }

                return response()->json(
                [
                    'api_message' => $query_update ? 'modifier' : 'non_modifier'
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
?>