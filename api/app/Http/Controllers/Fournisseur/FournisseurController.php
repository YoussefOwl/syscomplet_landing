<?php
namespace App\Http\Controllers\Fournisseur;

use App\Http\Controllers\Controller;
use App\Models\Fournisseurs\fournisseurs;
use App\Models\helpers;
use App\Traits\Globlal\ErrorHandling;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Crypt, DB, File, Storage, Validator};
use PHPUnit\Util\Exception;

class FournisseurController extends Controller
{
    use ErrorHandling;
    public function AfficherFournisseur(Request $request)
    {
        try {
            /* ------------------------------ les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "libelle_fournisseur";
            $order = $request->post('order') ? $request->post('order') : "asc";
            $extract_all = $request->post('extract_all') === true;

            /* -------------------------------- variables ------------------------------- */
            $libelle_fournisseur = helpers::handleValue($request->post('libelle_fournisseur'));
            $description = helpers::handleValue($request->post('description'));

            /* ------------------------------- la requete ------------------------------- */
            $liste_fournisseurs = fournisseurs::select("fournisseurs.*")
            ->when($libelle_fournisseur, fn($query)=> $query->where('libelle_fournisseur', 'like', "%$libelle_fournisseur%"))
            ->when($description, fn($query)=> $query->where('description', 'like', "%$description%"))
            ->orderBy($colone, $order);
            
            $totalRecords = $liste_fournisseurs->count(); // le total
            
            $liste_fournisseurs = ($extract_all ? $liste_fournisseurs : $liste_fournisseurs->skip($skip)->take($take))
            ->get()->map(function($item) {
                $item->_id = Crypt::encryptString($item->id);
                $item->image_fournisseur = $item->image_fournisseur && File::exists(public_path('storage/fournisseur/' . $item->image_fournisseur))
                ? asset('storage/fournisseur/' . $item->image_fournisseur)
                : null; 
                $item->created_at_formated = date('d-m-Y H:i', strtotime($item->created_at));
                $item->updated_at_formated = $item->updated_at? date('d-m-Y H:i', strtotime($item->updated_at)): null;
                return $item;
            });

            return $this->success([
                "data" => $liste_fournisseurs,
                "totalRecords" => $totalRecords,
            ]);
        } catch (Exception | QueryException $error) {
            return $this->error(["error" => $error->getMessage()]);
        }
    }

    public function AjouterFournisseur(Request $request)
    {
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'libelle_fournisseur' => 'required|string|max:255',
                'file_extension'      => 'required',
                'copie_multimedia'    => 'required'
            ]);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);

            $id_user_createur = Auth::user()->id;
            $file             = file_get_contents($request->input('copie_multimedia'));
            $file_extension   = trim($request->input('file_extension'));
            $libelle_fournisseur = helpers::handleValue($request->input('libelle_fournisseur'));
            $description = helpers::handleValue($request->input('description'));

            /* --------------------------------- ajouter -------------------------------- */
            $fournisseur = fournisseurs::create([
                'libelle_fournisseur' => $libelle_fournisseur,
                'description'         => $description,
            ]);
            
            if (! $fournisseur->save()) {
                return $this->api_message("error_ajout", ["title" => "Fournisseur non ajouté"]);
            }

            /* --------------------------------- upload --------------------------------- */
            $file_name        = $fournisseur->id.'-'.date("Y_m_d_H_i_s_s") . ".$file_extension";
            $fournisseur->update([
                'image_fournisseur'   => $file_name
            ]);

            if (! helpers::moveFile("fournisseur/$file_name", $file, 'public')) {
                DB::rollBack();
                return $this->api_message('error_ajout', ["title" => "Fournisseur non ajouté"]);
            }

            /* -------------------------------------------------------------------------- */
            $description_log = "Ajoute d'un nouvelle fournisseur : ID" . $fournisseur->id;
            helpers::Log_action('fournisseurs', $id_user_createur, "Ajoute d'un nouvelle fournisseur", $description_log);
            DB::commit();
            return $this->success();
        } catch (Exception | QueryException $error) {
            DB::rollBack();
            return $this->error(["error" => $error->getMessage()]);
        }
    }

    public function ModifierFournisseur(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                '_id' => 'required',
                'libelle_fournisseur' => 'required|string|max:255',
            ]);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);
            
            $_id = Crypt::decryptString($request->input('_id'));
            $id_user_createur = Auth::user()->id;

            $fournisseur = fournisseurs::find($_id);
            $old_value = clone $fournisseur;
            $fournisseur = $fournisseur->update([
                'libelle_fournisseur' => helpers::handleValue($request->input('libelle_fournisseur')),
                'description'         => helpers::handleValue($request->input('description')),
            ]);

            if (!$fournisseur) {
                return $this->api_message("error_update", ["title" => "Fournisseur non modifié"]);
            }

            /* -------------------------------------------------------------------------- */
            $description_log = "Modification de fournisseur : ID" . $_id;
            helpers::Log_action('fournisseurs', $id_user_createur, "Modification d'un fournisseur", $description_log, [
                'old_value' => $old_value,
                'new_value' => $fournisseur,
            ]);
            
            return $this->success();
        } catch (Exception | QueryException $error) {
            return $this->error(["error" => $error->getMessage()]);
        }
    }

    public function SupprimerFournisseur(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                '_id' => 'required',
            ]);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);
            $_id = Crypt::decryptString($request->input('_id'));
            $id_user_createur = Auth::user()->id;
            $fournisseur = fournisseurs::find($_id);

            /* ------------------------------ delete image ------------------------------ */
            if ($fournisseur->image_fournisseur) 
            {
                /* ----------------------------- delete old file ---------------------------- */
                if(File::exists(storage_path("app/public/fournisseur/$fournisseur->image_fournisseur")))
                {
                    Storage::disk('public')->delete("fournisseur/$fournisseur->image_fournisseur");
                }
            }
            
            /* ---------------------------------- save ---------------------------------- */
            $old_value = clone $fournisseur;
            if (!$fournisseur->delete()) return $this->api_message("error_delete", ["title" => "Fournisseur non supprimé"]);

            /* -------------------------------------------------------------------------- */
            $description_log = "Suppression de fournisseur : ID" . $_id;
            helpers::Log_action('fournisseurs', $id_user_createur, "Suppression d'un fournisseur", $description_log, [
                'old_value' => $old_value,
                'new_value' => $fournisseur,
            ]);

            return $this->success();
        } catch (Exception | QueryException $error) {
            return $this->error(["error" => $error->getMessage()]);
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
            $fournisseur = fournisseurs::find($_id);

            if ($fournisseur->image_fournisseur) 
            {
                /* ----------------------------- delete old file ---------------------------- */
                if(File::exists(storage_path("app/public/fournisseur/$fournisseur->image_fournisseur")))
                {
                    Storage::disk('public')->delete("fournisseur/$fournisseur->image_fournisseur");
                }
                $fournisseur->image_fournisseur = null; // Reset the image field
            }

            /* ------------------------- add image to repository ------------------------ */
            if(!helpers::moveFile("fournisseur/$file_name",$file,'public'))
            {
                DB::rollBack();
                return $this->api_message('file_error');   
            }
            $fournisseur->image_fournisseur = $file_name;
            $fournisseur->save();
            /* -------------------------------------------------------------------------- */   
            $description_log = "Ajout d'une nouvelle image au fournisseur avec l'identifiant : $_id dans la base de données.";
            helpers::Log_action('fournisseurs', $id_user_createur, "Ajout d'une image au fournisseur", $description_log);

            DB::commit();
            return $this->success();
        } catch (Exception | QueryException $error)  {
            DB::rollBack();
            return $this->error(["erreur" => $error]);
        }
    }
}
