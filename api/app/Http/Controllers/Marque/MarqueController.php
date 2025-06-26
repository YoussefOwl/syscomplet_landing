<?php

namespace App\Http\Controllers\Marque;

use App\Http\Controllers\Controller;
use App\Models\Marques\marques;
use App\Models\helpers;
use App\Traits\Globlal\ErrorHandling;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Crypt, DB, File, Storage, Validator};
use PHPUnit\Util\Exception;

class MarqueController extends Controller
{
    use ErrorHandling;

    public function AfficherMarque(Request $request)
    {
        try {
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "libelle_marque";
            $order = $request->post('order') ? $request->post('order') : "asc";
            $extract_all = $request->post('extract_all') === true;

            $libelle_marque = helpers::handleValue($request->post('libelle_marque'));
            $description = helpers::handleValue($request->post('description'));

            $liste_marques = marques::select("marques.*")
                ->when($libelle_marque, fn($query) => $query->where('libelle_marque', 'like', "%$libelle_marque%"))
                ->when($description, fn($query) => $query->where('description', 'like', "%$description%"))
                ->orderBy($colone, $order);

            $totalRecords = $liste_marques->count();

            $liste_marques = ($extract_all ? $liste_marques : $liste_marques->skip($skip)->take($take))
                ->get()->map(function($item) {
                    $item->_id = Crypt::encryptString($item->id);
                    $item->image_marque = $item->image && File::exists(public_path('storage/marque/' . $item->image))
                        ? asset('storage/marque/' . $item->image)
                        : null;
                    $item->created_at_formated = date('d-m-Y H:i', strtotime($item->created_at));
                    $item->updated_at_formated = $item->updated_at ? date('d-m-Y H:i', strtotime($item->updated_at)) : null;
                    return $item;
                });

            return $this->success([
                "data" => $liste_marques,
                "totalRecords" => $totalRecords,
            ]);
        } catch (Exception | QueryException $error) {
            return $this->error(["error" => $error->getMessage()]);
        }
    }

    public function AjouterMarque(Request $request)
    {
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'libelle_marque' => 'required|string|max:255',
                'file_extension' => 'required',
                'copie_multimedia' => 'required'
            ]);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);

            $id_user_createur = Auth::user()->id;
            $file = file_get_contents($request->input('copie_multimedia'));
            $file_extension = trim($request->input('file_extension'));
            $libelle_marque = helpers::handleValue($request->input('libelle_marque'));
            $description = helpers::handleValue($request->input('description'));

            $marque = marques::create([
                'libelle_marque' => $libelle_marque,
                'description' => $description,
            ]);

            if (!$marque->save()) {
                return $this->api_message("error_ajout", ["title" => "Marque non ajoutée"]);
            }

            $file_name = $marque->id . '-' . date("Y_m_d_H_i_s_s") . ".$file_extension";
            $marque->update([
                'image' => $file_name
            ]);

            if (!helpers::moveFile("marque/$file_name", $file, 'public')) {
                DB::rollBack();
                return $this->api_message('error_ajout', ["title" => "Marque non ajoutée"]);
            }

            $description_log = "Ajout d'une nouvelle marque : ID" . $marque->id;
            helpers::Log_action('marques', $id_user_createur, "Ajout d'une nouvelle marque", $description_log);
            DB::commit();
            return $this->success();
        } catch (Exception | QueryException $error) {
            DB::rollBack();
            return $this->error(["error" => $error->getMessage()]);
        }
    }

    public function ModifierMarque(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                '_id' => 'required',
                'libelle_marque' => 'required|string|max:255',
            ]);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);

            $_id = Crypt::decryptString($request->input('_id'));
            $id_user_createur = Auth::user()->id;

            $marque = marques::find($_id);
            $old_value = clone $marque;
            $marque = $marque->update([
                'libelle_marque' => helpers::handleValue($request->input('libelle_marque')),
                'description' => helpers::handleValue($request->input('description')),
            ]);

            if (!$marque) {
                return $this->api_message("error_update", ["title" => "Marque non modifiée"]);
            }

            $description_log = "Modification de la marque : ID" . $_id;
            helpers::Log_action('marques', $id_user_createur, "Modification d'une marque", $description_log, [
                'old_value' => $old_value,
                'new_value' => $marque,
            ]);

            return $this->success();
        } catch (Exception | QueryException $error) {
            return $this->error(["error" => $error->getMessage()]);
        }
    }

    public function SupprimerMarque(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                '_id' => 'required',
            ]);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);
            $_id = Crypt::decryptString($request->input('_id'));
            $id_user_createur = Auth::user()->id;
            $marque = marques::find($_id);

            if ($marque->image) {
                if (File::exists(storage_path("app/public/marque/$marque->image"))) {
                    Storage::disk('public')->delete("marque/$marque->image");
                }
            }

            $old_value = clone $marque;
            if (!$marque->delete()) return $this->api_message("error_delete", ["title" => "Marque non supprimée"]);

            $description_log = "Suppression de la marque : ID" . $_id;
            helpers::Log_action('marques', $id_user_createur, "Suppression d'une marque", $description_log, [
                'old_value' => $old_value,
                'new_value' => $marque,
            ]);

            return $this->success();
        } catch (Exception | QueryException $error) {
            return $this->error(["error" => $error->getMessage()]);
        }
    }

    public function ManageLogo(Request $request)
    {
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                '_id' => 'required',
                'file_extension' => 'required',
                'copie_multimedia' => 'required'
            ]);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);

            $_id = intval(Crypt::decryptString(trim($request->post('_id'))));
            $id_user_createur = Auth::user()->id;
            $file = file_get_contents($request->input('copie_multimedia'));
            $file_extension = trim($request->input('file_extension'));
            $file_name = $_id . '-' . date("Y_m_d_H_i_s_s") . ".$file_extension";

            $marque = marques::find($_id);

            if ($marque->image) {
                if (File::exists(storage_path("app/public/marque/$marque->image"))) {
                    Storage::disk('public')->delete("marque/$marque->image");
                }
                $marque->image = null;
            }

            if (!helpers::moveFile("marque/$file_name", $file, 'public')) {
                DB::rollBack();
                return $this->api_message('file_error');
            }
            $marque->image = $file_name;
            $marque->save();

            $description_log = "Ajout d'un nouveau logo à la marque avec l'identifiant : $_id dans la base de données.";
            helpers::Log_action('marques', $id_user_createur, "Ajout d'un logo à la marque", $description_log);

            DB::commit();
            return $this->success();
        } catch (Exception | QueryException $error) {
            DB::rollBack();
            return $this->error(["erreur" => $error]);
        }
    }
}
