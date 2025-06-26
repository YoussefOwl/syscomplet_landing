<?php

namespace App\Http\Controllers\Contenus;
use App\Http\Controllers\Controller;
use PHPUnit\Exception;
use Illuminate\Support\Facades\{Auth, Crypt,DB, File, Storage, Validator};
use App\Models\configurations\contenus;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\helpers;
use App\Traits\Globlal\ErrorHandling;

class ContenusController extends Controller
{
    use ErrorHandling;
    public function __construct() {}

    public function AfficherContenusAdmins(Request $request)
    {
        try
        {
            
            /* ------------------------------ les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "html_id";
            $order = $request->post('order') ? $request->post('order') : "asc";
            $if_excel = $request->post('if_excel') ? true : false;

            /* ---------------------- les variables de la recherche --------------------- */
            $description_fr = helpers::handleValue($request->post('description_fr'));
            $description_ar = helpers::handleValue($request->post('description_ar'));
            $page = helpers::handleValue($request->post('page'));
            $page_position = helpers::handleValue($request->post('page_position'));
            $html_id = $request->post('html_id') ? trim($request->post('html_id')) : null;
            
            /* ------------------------------- La requête ------------------------------- */
            $liste_contenus = contenus::select('contenus.*');
            
            /* -------------------------------------------------------------------------- */
            /*                         Les filitres de la recherche                       */
            /* -------------------------------------------------------------------------- */
          
            $conditions = [
                'contenus.description_fr' => $description_fr,
                'contenus.description_ar' => $description_ar,
                'contenus.html_id' => $html_id,
                'page' => $page,
                'page_position' => $page_position,
            ];

            foreach ($conditions as $column => $value) {
                if ($value) {
                    $liste_contenus = $liste_contenus->where($column, 'like', '%' . $value . '%');
                }
            }
            
            /* -------------------------------------------------------------------------- */
            /*                                 TRAITEMENTS                                */
            /* -------------------------------------------------------------------------- */

            $totalRecords = $liste_contenus->count(); // le total

            $liste_contenus = $if_excel
            ? $liste_contenus->orderBy($colone,$order)->get()
            : $liste_contenus->orderBy($colone,$order)->skip($skip)->take($take)->get();

            foreach ($liste_contenus as $rec)
            {
                $rec['_id'] = Crypt::encryptString($rec['id']);
                $rec['base_id'] = 'HTML_'.$rec['id'];
                $rec["image"] = $rec['image'] && File::exists(storage_path("app/public/contenus/".$rec["image"])) 
                ? asset('storage/contenus/'.$rec['image']) 
                : null;
                $rec['page_label'] =  helpers::GetLabels($rec->page, 'liste_pages');
                $rec['page_position_label'] = helpers::GetLabels($rec->page_position, 'liste_page_positions');
                $rec['created_at_formated'] = $rec['created_at'] ? Carbon::parse($rec['created_at'])->format('d-m-Y H:i') : null;
                $rec['updated_at_formated'] = $rec['updated_at'] ? Carbon::parse($rec['updated_at'])->format('d-m-Y H:i') : null;
                unset($rec['id']);
            }
            return response()->json(
            [
                'api_message' => 'success',
                'totalRecords' => $totalRecords,
                'Data' => $liste_contenus
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

    public function AjouterContenus(Request $request)
    {
        try
        {
            
            $messages = [
                '_id' => 'required|in:0,"0"',
                'html_id' => 'required|min:1|unique:contenus',
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
                $html_id = helpers::handleValue($request->post('html_id'), removeSpaces:true);
                $page = helpers::handleValue($request->post('page'));
                $page_position = helpers::handleValue($request->post('page_position'));
                $class = helpers::handleValue($request->post('class'));
                $autre = helpers::handleValue($request->post('autre'));
                /* ----------------------- Traitement du contenu reçu ----------------------- */
                /* -------------------------------- FRANCAIS -------------------------------- */
                $description_fr_input = $request->post('description_fr');
                if ($description_fr_input !== null && $description_fr_input !== "null") {
                    // Trim, replace '&nbsp;' with a space
                    $description_fr = str_replace('&nbsp;', ' ', trim($description_fr_input));
                } else { $description_fr = null;}
                /* ---------------------------------- ARABE --------------------------------- */
                $description_ar_input = $request->post('description_ar');
                if ($description_ar_input !== null && $description_ar_input !== "null") {
                    // Trim, replace '&nbsp;' with a space
                    $description_ar = str_replace('&nbsp;', ' ', trim($description_ar_input));
                } else { $description_ar = null;}

                /* -------------------------- Recherche si existant ------------------------- */
                $contenu = DB::table('contenus')
                ->where('html_id',$html_id)
                ->first();

                if ($contenu) // Si le contenu est existant
                {
                    return response()->json(
                    [
                        'api_message' => 'existant'
                    ], 200);  
                }

                else // Si le contenu est non existant
                {
                    $query_ajouter = contenus::create([
                        'html_id' => $html_id,
                        'description_fr' => $description_fr,
                        'description_ar' => $description_ar,
                        'page' => $page,
                        'page_position' => $page_position,
                        'class' => $class,
                        'autre' => $autre,
                        'updated_at' => null
                    ]);
                    
                    if($query_ajouter->save())
                    {
                        /* -------------------------------------------------------------------------- */
                        /*                                 LOG ACTION                                 */
                        /* -------------------------------------------------------------------------- */
                        $description_log = 'Ajout du contenu qui a comme identifiant sur la base : '.$query_ajouter->id;
                        helpers::Log_action('contenus',helpers::get_id_logger(),"Ajout d'un contenu",$description_log,$request->all());
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
    
    public function ModifierContenu(Request $request)
    {
        try
        {
            
            $messages = [
                '_id' => 'required|not_in:0,"0"',
                'html_id' => 'required|min:1',
                'page' => 'required',
                'page_position' => 'required',
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
            
            
            /* ------------------------------ les variables ----------------------------- */
            $_id = intval(Crypt::decryptString(trim($request->post('_id'))));
            $html_id = helpers::handleValue($request->post('html_id'), removeSpaces:true);
            $page = helpers::handleValue($request->post('page'));
            $page_position = helpers::handleValue($request->post('page_position'));
            $class = helpers::handleValue($request->post('class'));
            $autre = helpers::handleValue($request->post('autre'));
            /* ----------------------- Traitement du contenu reçu ----------------------- */
            /* -------------------------------- FRANCAIS -------------------------------- */
            $description_fr_input = $request->post('description_fr');
            if ($description_fr_input !== null && $description_fr_input !== "null") {
                // Trim, replace '&nbsp;' with a space
                $description_fr = str_replace('&nbsp;', ' ', trim($description_fr_input));
            } else { $description_fr = null;}
            /* ---------------------------------- ARABE --------------------------------- */
            $description_ar_input = $request->post('description_ar');
            if ($description_ar_input !== null && $description_ar_input !== "null") {
                // Trim, replace '&nbsp;' with a space
                $description_ar = str_replace('&nbsp;', ' ', trim($description_ar_input));
            } else { $description_ar = null;}
            
            /* -------------------------- Recherche si existant ------------------------- */
            $contenu = DB::table('contenus')
            ->where([
                ['html_id',$html_id],
                ['id','!=',$_id]
            ])
            ->first();

            if ($contenu) // Si le contenu est existant
            {
                return response()->json(
                [
                    'api_message' => 'existant'
                ], 200);  
            }

            /* ----------------------- La requête de modification ----------------------- */
            $query_update = DB::table('contenus')
            ->where('id',$_id)
            ->update(
                array(
                'updated_at' => date("Y-m-d H:i:s"),
                'html_id' => $html_id,
                'page' => $page,
                'page_position' => $page_position,
                'class' => $class,
                'autre' => $autre,
                'description_fr' => $description_fr,
                'description_ar' => $description_ar,
            ));

            if ($query_update)
            {
                helpers::Log_action('contenus',helpers::get_id_logger(),"Modification d'une section de contenu","Identifiant : $_id",$request->all());
            }

            return response()->json(
            [
                'api_message' => $query_update ? 'modifier' : 'non_modifier'
            ],200);
            
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

    /* -------------------------------------------------------------------------- */
    /*                                    image                                   */
    /* -------------------------------------------------------------------------- */
    public function ManageImage(Request $request) 
    {
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(),[
                '_id' => 'required',
                'file_extension' => 'required',
                'copie_multimedia' => 'required'
            ]);
            if ($validator->fails()) return $this->api_message(data:[$validator->errors()]);

            $_id = intval(Crypt::decryptString(trim($request->post('_id'))));
            $id_user_createur = Auth::user()->id;
            $file = file_get_contents($request->input('copie_multimedia'));
            $file_extension = trim($request->input('file_extension'));
            $file_name = $_id.'-'.date("Y_m_d_H_i_s_s").".$file_extension";
            /* ---------------------------------- ajout --------------------------------- */
            $contenu = contenus::find($_id);

            if ($contenu->image) 
            {
                /* ----------------------------- delete old file ---------------------------- */
                if(File::exists(storage_path("app/public/contenus/$contenu->image")))
                {
                    Storage::disk('public')->delete("contenus/$contenu->image");
                }
                $contenu->image = null; // Reset the image field
            }

            /* ------------------------- add image to repository ------------------------ */
            if(!helpers::moveFile("contenus/$file_name",$file,'public'))
            {
                DB::rollBack();
                return $this->api_message('file_error');   
            }
            $contenu->image = $file_name;
            $contenu->save();
            /* -------------------------------------------------------------------------- */   
            $description_log = "Ajout d'une nouvelle image au contenu qui a comme identifiant sur la base : $_id";
            helpers::Log_action('contenus', $id_user_createur, "Ajout d'une nouvelle image au contenu",$description_log);

            DB::commit();
            return $this->success();
        } catch (Exception | QueryException $error)  {
            DB::rollBack();
            return $this->error(["erreur" => $error]);
        }
    }

    public function SupprimerImage(Request $request) 
    {
        try {
            $_id = intval(Crypt::decryptString(trim($request->post('_id'))));
            $contenu = contenus::find($_id);

            if ($contenu->image) 
            {
                /* ----------------------------- delete old file ---------------------------- */
                if(File::exists(storage_path("app/public/contenus/$contenu->image")))
                {
                    Storage::disk('public')->delete("contenus/$contenu->image");
                }
                $contenu->image = null; // Reset the image field
                $contenu->save(); // Reset the image field
            }

            return $this->success();
        } catch (Exception | QueryException $error) {
            DB::rollBack();
            return $this->error(["erreur" => $error]);
        }
    }

    public function AfficherContenusFo()
    {
        try
        {
            return response()->json(
            [
                'api_message' => 'success',
                'phone' => env('phone'),
                'footer_mail' => env('footer_mail'),
                'Data' => contenus::select(
                    'html_id',
                    'description_fr',
                    'description_ar'
                )
                ->get()
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
}