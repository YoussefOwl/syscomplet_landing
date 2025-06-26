<?php

namespace App\Http\Controllers\Utilisateur;
use App\Http\Controllers\Controller;
use PHPUnit\Exception;
use App\Models\users\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,Crypt,DB,Hash,Validator,File,Storage};
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use Illuminate\Database\QueryException;
use App\Models\helpers;
use Carbon\Carbon;
class UserController extends Controller
{

    public function LoginUtilisateur(Request $request)
    {
        try
        {
            /* ----------------------------- Les validations ---------------------------- */
            $messages = [
                'email' => 'required|email|min:10|max:100',
                'password' => 'required|min:6|max:30',
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
                /* ------------------------------ Les variables ----------------------------- */
                $email = preg_replace('/\s+/', '', mb_strtolower($request->post('email')));
                $credentials = array(
                    'email' => $email,
                    'password' => $request->post('password')
                );
                
                /* ----------------------- Recherche de l'utilisateur ----------------------- */
                $user = DB::table('users')
                ->join('roles', 'users.id_role', '=', 'roles.id')
                ->select('users.*', 'roles.libelle_role', 'roles.sidebar')
                ->where('email', $email)
                ->first();

                /* --------------------- Si l'utilisateur est inexistant -------------------- */

                if (!$user)
                {
                    return response()->json(
                    [
                        'api_message' => 'non_existant'
                    ], 200);
                }

                /* -------------------------------------------------------------------------- */
                /*                                 Email existant                             */
                /* -------------------------------------------------------------------------- */
                else 
                {
                    if($user->deleted_at!=null) // utilisateur supprimé précédemment
                    {
                        return response()->json(
                        [
                            'api_message' => 'deleted'
                        ], 200);
                    }

                    else // utilisateur non supprimé
                    {
                        if ($user->has_access == intval(env('has_access_yes')))
                        {
                            /* ----------------------- JWT laravel authentication ----------------------- */
                            if (!$jwt_generated_token = \PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth::attempt($credentials))
                            {
                                return response()->json(
                                [
                                    'api_message' => 'mot_de_passe_invalide'
                                ], 200);
                            }
                            else
                            {
                                helpers::Log_action('users',Auth::id(),"Login sur le système");
                                return response()->json(
                                [
                                    'api_message' => 'valide',
                                    'auth_infos' => [
                                        /* ------------------------- le token d'autorization ------------------------ */
                                        array(
                                            'key' => "jwt_generated_token",
                                            'value' => $jwt_generated_token
                                        ),
                                        array(
                                            'key' => "nom",
                                            'value' => $user->nom
                                        ),
                                        array(
                                            'key' => "if_has_sound",
                                            'value' => $user->if_has_sound ? 'true' : 'false'
                                        ),
                                        array(
                                            'key' => "prenom",
                                            'value' => $user->prenom
                                        ),
                                        array(
                                            'key' => "image_user_path",
                                            'value' => $user->image_user, // le chemin de l'image du profile
                                        ),
                                        array(
                                            'key' => "id_user",
                                            'value' => Crypt::encryptString(Auth::id()),
                                        ),
                                        array(
                                            'key' => "libelle_role",
                                            'value' => $user->libelle_role,
                                        ),
                                        array(
                                            'key' => "sidebar",
                                            'value' => json_decode($user->sidebar)
                                        ),
                                        array(
                                            'key' => "Expiration",
                                            'value' => (config('jwt.ttl') * 60 / 3600).' '.'Heure(s)'
                                        ),
                                    ],
                                    'can_access' => array_merge(
                                        /* ---------------------- Les droits des manipulations ---------------------- */
                                        config('config_can_manipulate_front'),
                                        /* ------------------- Pour les guards des modules angular ------------------ */
                                        config('can_access_modules')
                                    ),
                                    // Convertis en base64 puis en md5 ,utilisé pour les guards et les ngifs dans les composants coté front //
                                    'id_role_crypted_front' => md5(base64_encode($user->id_role))
                                ], 200);
                            }
                        }
                        else
                        {
                            return response()->json(
                            [
                                'api_message' => 'non_autoriser'
                            ], 200);
                        }
                    }
                } // fin Email existant
            } // fin else validators Ok
        } // fin try

        catch (JWTException $error)
        {
            return response()->json(
            [
                'api_message' => 'erreur_jwt',
                'erreur' => $error
            ], 200);
        }
        catch (Exception $error)
        {
           return helpers::apiResponse('erreur',null,$error);
        }
        catch (QueryException $error)
        {
            return response()->json(
            [
                'api_message' => 'erreur_database',
                'erreur' => $error
            ], 200);
        }
    }

    /* ------------------------- Ajouter un utilisateur ------------------------- */
    public function AjouterUtilisateur(Request $request)
    {
        try
        {
            
            $messages = [
                'id_role' => 'required',
                'has_access' => 'required',
                'nom' => 'required|min:3',
                'prenom' => 'required|min:3',
                'email' => 'required|email|min:10|max:100',
                'password' => 'required|min:6'
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

            else // validation Ok
            {
                /* ------------------------------ les variables ----------------------------- */
                $email = preg_replace('/\s+/', '', mb_strtolower($request->post('email')));

                /* ----------------- Chercher si l'utilisateur est existant ----------------- */
                $user = DB::table('users')
                ->select('users.id','users.deleted_at')
                ->where('email', $email)
                ->first();

                if($user)
                {
                    if($user->deleted_at!=null) // utilisateur existant et supprimé précédemment
                    {
                        return response()->json(
                        [
                            'api_message' => 'already_deleted', // il faut le restaurer
                            'id_user' => Crypt::encryptString($user->id)
                        ], 200);
                    }
                    else // utilisateur existant non supprimé
                    {
                        return response()->json(
                        [
                            'api_message' => 'existant'
                        ], 200);
                    }
                }
                /* ------------------------- utilisateur inexistant ------------------------- */
                else
                {
                    /* ------------------------ Traitement des variables ------------------------ */

                    $nom = mb_convert_case(mb_strtolower(trim($request->post('nom'))),MB_CASE_TITLE,"UTF-8");
                    $prenom = mb_convert_case(mb_strtolower(trim($request->post('prenom'))),MB_CASE_TITLE,"UTF-8");
                    $password = Hash::make(trim($request->post('password')));
                    $if_has_sound = intval($request->post('if_has_sound'));
                    $array_to_add = [
                        'id_role' => intval($request->post('id_role')),
                        'has_access' => intval($request->post('has_access')),
                        'nom' => $nom,
                        'prenom' => $prenom,
                        'email' => $email,
                        'if_has_sound' => $if_has_sound,
                        'password' => $password
                    ];
                    /* ----------------------------- Requête d'ajout ---------------------------- */
                    $query_ajouter = User::create($array_to_add);

                    /* -------------- Log saving and returning response to Frontend ------------- */
                    if($query_ajouter->save())
                    {
                        unset($array_to_add['password']);
                        helpers::Log_action('users',helpers::get_id_logger(),"Ajout d'un utlisateur",null,$array_to_add);
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

    /* ----------- Récupération des infos d'un utilisateur via son Id ----------- */
    public function GetMyInfo(Request $request)
    {
        try
        {
            
            /* ------------------------------- Validation ------------------------------- */
            $messages = ['id_user' => 'required'];

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
                /* ------ récupération et décryptage de l'identifiant de l'utilisateur ------ */
                
                $id_user = intval(Crypt::decryptString(trim($request->post('id_user'))));

                /* --------- la requête de récupération des données de l'utilsateur --------- */

                $my_info = User::join('roles', 'users.id_role', '=', 'roles.id')
                ->select('users.*','roles.libelle_role')
                ->where('users.id',$id_user)
                ->first();

                return response()->json(
                [
                    'api_message' => 'success',
                    'my_info' => $my_info
                ], 200);
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

    public function ModifierUtilisateur(Request $request)
    {
        try
        {
            
            $messages = [
                'id' => 'required', // identifiant de l'utilisateur à modifier
                'nom' => 'required|min:3|max:50',
                'prenom' => 'required|min:3|max:50',
                'email' => 'required|email|min:10|max:100'
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

            else // Mise à jour des informations du profile
            {
                /* ------- décryptage de l'identifiant de l'utilisateur à modifier ------- */
                $id = intval(Crypt::decryptString(trim($request->post('id'))));
                $email = preg_replace('/\s+/', '', mb_strtolower($request->post('email')));
                $nom = mb_convert_case(mb_strtolower(trim($request->post('nom'))),MB_CASE_TITLE,"UTF-8");
                $prenom = mb_convert_case(mb_strtolower(trim($request->post('prenom'))),MB_CASE_TITLE,"UTF-8");

                /* ------------------------ Check duplicate tentative ----------------------- */
                $if_dublicate_tentative = DB::select(
                    'select id from users where id != :id and email = :email',
                    [
                        ':id' => intval($id),
                        ':email' => $email
                    ]
                );

                if ($if_dublicate_tentative) // s'il s'agit d'une tentative de duplication des données
                {
                    return response()->json(
                    [
                        'api_message' => 'existant'
                    ], 200);
                }

                else // si il n'y a pas de duplication
                {
                    $query_update = DB::table('users')
                    ->where('id',$id)
                    ->update(
                        array(
                        'email' => $email,
                        'nom' => $nom,
                        'prenom' => $prenom,
                        'updated_at' => date("Y-m-d H:i:s")
                    ));

                    if($query_update)
                    {
                        helpers::Log_action('users',helpers::get_id_logger(),"Modification d'un utlisateur",null,$request->all());
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
           return response()->json(
           [
               'api_message' => 'erreur',
               'erreur' => $error
           ], 200);
       }
    }

    public function ChangePassword(Request $request)
    {
        try
        {
            
            $messages = [
                'new_password' => 'required|min:6|max:30',
                'id_user' => 'required'
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

            else // les données reçues sont valide
            {
                /* ----------------------- Récupération des variables ----------------------- */
                $id_user = intval(Crypt::decryptString(trim($request->post('id_user')))); // décryptage de l'identifiant de l'utilisateur à modifier

                /* ----------------------- la requête de modification ----------------------- */
                $query_change_pwd = DB::table('users')
                ->where('id',intval($id_user))
                ->update(array(
                    'updated_at' => date("Y-m-d H:i:s"),
                    'password' => Hash::make(trim($request->post('new_password')))
                ));
                
                if ($query_change_pwd)
                {
                    helpers::Log_action('users',helpers::get_id_logger(),
                    "Modification du mot de passe d'un utlisateur",
                    "Modification du mot de passe de l'utlisateur qui a comme identifiant interne : ".$id_user);
                }

                return response()->json(
                [
                    'api_message' => $query_change_pwd ? 'updated' : 'not_updated'
                ],200);
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

    /* ------------------ Supprimer logiquement un utilisateur ------------------ */
    public function SupprimerUtilisateur(Request $request)
    {
        try
        {
            
            $messages = [
                'id' => 'required', // identifiant de l'utilisateur à suppirmée
                'id_user' => 'required' // identifiant de l'utilisateur qui veut faire l'action
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
                /* ------- décryptage de l'identifiant de l'utilisateur à supprimer ------- */
                $id = intval(Crypt::decryptString(trim($request->post('id'))));
                $id_user = intval(Crypt::decryptString(trim($request->post('id_user'))));

                if($id==$id_user) // un utlisateur ne peut pas supprimer son compte
                {
                    return response()->json(
                    [
                        'api_message' => 'action_impossible'
                    ], 200);
                }

                else
                {
                    /* ---------------------- Reqête de suppression logique --------------------- */
                    $query_delete = DB::table('users')
                    ->where('id',$id)
                    ->update(['deleted_at' => date("Y-m-d H:i:s")]);

                    if($query_delete)
                    {
                        helpers::Log_action('users',helpers::get_id_logger(),"Suppression d'un utlisateur",null,$request->all());
                    }

                    return response()->json(
                    [
                        'api_message' => $query_delete ? 'supprimer' : 'non_supprimer'
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

    /* ---------------- La fonction d'affichage des utilisateurs ---------------- */
    public function AfficherUtilisateur(Request $request)
    {
        try
        {
            
            /* ------------------------------ Les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "nom";
            $order = $request->post('order') ? $request->post('order') : "asc";
            $if_excel = $request->post('if_excel') ? true : false;
            /* ------------------------ les variables de recherche ----------------------- */
            $has_access = $request->post('has_access') ? intval($request->post('has_access')) : null;
            $nom_complet = $request->post('nom_complet') ? trim($request->post('nom_complet')) : null;
            
            /* ------------------------------- la requête ------------------------------- */
            $liste_utilisateur = User::join('roles', 'users.id_role', '=', 'roles.id')
            ->select(
                'users.*',
                DB::raw('CONCAT(nom, " ", prenom) AS nom_complet'),
                'roles.libelle_role')
            ->whereNull('users.deleted_at');

            /* -------------------------------------------------------------------------- */
            /*                           Filtres de la recherches                         */
            /* -------------------------------------------------------------------------- */
            if($nom_complet)
            {
                $liste_utilisateur = $liste_utilisateur->where(function($query) use ($nom_complet) {
                    $query->where('nom', 'like', '%' . $nom_complet . '%')
                    ->orWhere('prenom', 'like', '%' . $nom_complet . '%');
                });
            }
            if($has_access)
            {
                $liste_utilisateur = $liste_utilisateur->where('users.has_access',$has_access);
            }

            /* ---------------- Le total des utilisateurs sans pagination ---------------- */
            $totalRecords = $liste_utilisateur->count();

            /* ----------------------- Finalisation de la requête ----------------------- */
            $liste_utilisateur = $if_excel
            ? $liste_utilisateur->orderBy($colone,$order)->get()
            : $liste_utilisateur->orderBy($colone,$order)->skip($skip)->take($take)->get();

            /* ------------------------- Traitement des données ------------------------- */
            foreach ($liste_utilisateur as $key)
            {
                $key['_id'] = Crypt::encryptString($key['id']);
                $key['label_has_access'] = helpers::GetLabels($key['has_access'],'liste_autorisations');
                $key['badge_has_access'] = helpers::GetLabels($key['has_access'],'liste_autorisations',"badge");
                $key['if_can_update_line_user'] = (intval($key['id'])==helpers::get_id_logger()) || helpers::if_user_is_admin()
                ? true
                : false;
                /* --------------------------- L'image du profile --------------------------- */
                $key['image_user_path'] = $key['image_user'];
                $key['image_user'] = $key['image_user'] ? helpers::get_image($key['image_user'],'profile') : null; // image base64
                $key['created_at_formated'] = $key['created_at'] ? Carbon::parse($key['created_at'])->format('d-m-Y H:i') : null;
                $key['updated_at_formated'] = $key['updated_at'] ? Carbon::parse($key['updated_at'])->format('d-m-Y H:i') : null;
                $key['base_id'] = $key['id'];
                unset($key['id']);
            }

            return response()->json(
            [
                'api_message' =>'success',
                'totalRecords' => $totalRecords,
                'Data' => $liste_utilisateur
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

    /* -------------------------------------------------------------------------- */
    /*                Les fonctions de getion de l'image du profile               */
    /* -------------------------------------------------------------------------- */

    public function AfficherMonImage(Request $request)
    {
        try
        {
            
            $messages = [
                'id_user' => 'required',
                'image_user_path' => 'required'
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
                /* ----------------------- Récupération des variables ----------------------- */
                if(intval(Crypt::decryptString(trim($request->post('id_user'))))) // décryptage de l'identifiant de l'utilisateur à modifier
                {
                    return response()->json(
                    [
                        'api_message' => 'success',
                        'image_user' => helpers::get_image($request->post('image_user_path'),'profile')
                    ], 200);
                }
                else
                {
                    return response()->json(
                    [
                        'api_message' => 'erreur',
                    ], 200);
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

    public function ModifierMonImage(Request $request)
    {
        try
        {
            
            /* --------------------------- Fix bug de mémoires -------------------------- */
            ini_set('memory_limit', '-1');
            ini_set('max_execution_time', '300'); // 5 minutes

            /* ------------------------------- Validations ------------------------------ */
            $messages = ['id_user' => 'required'];
            $validator = Validator::make($request->all(),$messages,$messages);

            if ($validator->fails() || !$request->hasFile('copie_image'))
            {
                return response()->json(
                [
                    'api_message' => 'erreur_de_parametres',
                    'erreur' => $validator->errors()
                ],200);
            }

            /* ----------------------- Les parametres sont valides ---------------------- */
            else
            {
                /* ------------------------ Déclaration des variables ----------------------- */
                $saved_file = null;
                $id_user = intval(Crypt::decryptString(trim($request->post('id_user')))); // décryptage de l'identifiant de l'utilisateur à modifier

                if($request->post('image_old')) // suppression de l'ancienne image
                {
                    $old = storage_path('app/private/profile/'.$request->post('image_old'));

                    if(File::exists($old))
                    {
                        Storage::disk('profile')->delete($request->post('image_old'));
                    }
                }

                /* --------------------------------- Upload --------------------------------- */
                $file = $request->file('copie_image')->openFile();
                $content = $file->fread($file->getSize());
                $saved_file = date("Y_m_d_H_i_s").'_'.Str::random(4)."_image".$id_user.".".$request->post('extention_copie_image');

                if(helpers::moveFile($saved_file, $content,'profile'))
                {
                    $query_update = DB::table('users')
                    ->where('id',$id_user)
                    ->update(array(
                        'updated_at' => date("Y-m-d H:i:s"),
                        'image_user' => $saved_file
                    ));

                    if ($query_update)
                    {
                        helpers::Log_action('users',helpers::get_id_logger(),"Modification d'image d'utlisateur",null,$request->all());
                        return response()->json(
                        [
                            'api_message' => 'success',
                            'image_user_path' => $saved_file
                        ], 200);
                    }
                    else
                    {
                        return response()->json(
                        [
                            'api_message' => 'erreur',
                            'erreur' => 'Erreur mise à jour image'
                        ],200);  
                    }
                }
                
                else
                {
                    return response()->json(
                    [
                        'api_message' => 'erreur',
                        'erreur' => 'Erreur upload image'
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

    public function SupprimerMonImage(Request $request)
    {
        try 
        {
            
            $messages = [
                'image_user_path' => 'required',
                'id_user' => 'required'
            ];

            $validator = Validator::make($request->all(),$messages,$messages);

            if ($validator->fails())
            {
                return response()->json(
                [
                    'api_message' => 'erreur_de_parametres',
                    'erreur' => $validator->errors()
                ],200);
            }

            else
            {
                /* ---------------------------- Delete old image ---------------------------- */

                $old = storage_path('app/private/profile/'.$request->post('image_user_path'));
                if(File::exists($old))
                {
                    Storage::disk('profile')->delete($request->post('image_user_path'));
                }

                /* --------- décryptage de l'identifiant de l'utilisateur à modifier -------- */

                $id_user = intval(Crypt::decryptString(trim($request->post('id_user'))));

                /* ----------------------------- Update database ---------------------------- */

                $query_delete_image = DB::table('users')
                ->where('id',$id_user)
                ->update(
                    array(
                        'updated_at' => date("Y-m-d H:i:s"),
                        'image_user' => null
                    )
                );

                if ($query_delete_image)
                {
                    helpers::Log_action('users',helpers::get_id_logger(),"Suppression d'image d'un utlisateur",null,$request->all());
                }
                return response()->json(
                [
                    'api_message' => $query_delete_image ? 'success' : 'erreur'
                ], 200);
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

    /* ----------------- Gestion des paramètres d'un utilisateur ---------------- */
    public function ModifierParmsUtilisateur(Request $request)
    {
        try
        {
            
            $messages = [
                '_id' => 'required', // identifiant de l'utilisateur
                'has_access' => 'required', // 0 non autorisé // 1 autorisé
                'id_role' => 'required' // soit administrateur soit gestionnaire
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
                /* ------------------------------- décryptage ------------------------------- */
                $_id = intval(Crypt::decryptString(trim($request->post('_id'))));
                $id_role = intval(trim($request->post('id_role')));

                /* ------- Self change role is impossible ------- */
                if($_id == helpers::get_id_logger() && ($id_role!=User::where('id',$_id)->value('id_role')))
                {
                    return response()->json(
                    [
                        'api_message' => 'action_impossible'
                    ],200);
                }

                else
                {
                    /* ---------------------- Reqête de suppression logique --------------------- */
                    $query_update_user_params = DB::table('users')
                    ->where('id',$_id)
                    ->update(
                        array(
                        'id_role' => $id_role,
                        'has_access' => intval($request->post('has_access')),
                        'if_has_sound' => intval($request->post('if_has_sound')),
                        'updated_at' => date("Y-m-d H:i:s")
                    ));

                    if ($query_update_user_params)
                    {
                        helpers::Log_action('users',helpers::get_id_logger(),"Modification des paramètres d'un utlisateur",null,$request->all());
                    }
                    return response()->json(
                    [
                        'api_message' => $query_update_user_params ? 'modifier' : 'non_modifier'
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

    public function RestaurerUser(Request $request)
    {
        try
        {
            
            $messages = [
                'id_user' => 'required' // identifiant de l'utilisateur à réstaurer
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
                $id_user = intval(Crypt::decryptString(trim($request->post('id_user'))));

                /* ------------------------------- La requête ------------------------------- */
                $query_restaure = DB::table('users')
                ->where('id',$id_user)
                ->update(array('deleted_at' => null));
                
                if ($query_restaure)
                {
                    helpers::Log_action('users',helpers::get_id_logger(),"Restauration d'un utlisateur",null,$request->all());
                }
                return response()->json(
                [
                    'api_message' => $query_restaure ? 'success' : 'non_restaurer'
                ],200);
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