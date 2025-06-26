<?php

namespace App\Http\Controllers\Articles;

use App\Http\Controllers\Controller;
use App\Models\articles\articles;
use App\Models\helpers;
use App\Traits\Globlal\ErrorHandling;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Util\Exception;

class ArticleController extends Controller
{
    use ErrorHandling;

    public function AfficherArticle(Request $request)
    {
        try {
            /* ------------------------------ les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "libelle_article";
            $order = $request->post('order') ? $request->post('order') : "asc";
            $extract_all = $request->post('extract_all') === true;

            /* -------------------------------- variables ------------------------------- */
            $libelle_article = helpers::handleValue($request->post('libelle_article'));
            $description = helpers::handleValue($request->post('description'));

            /* ------------------------------- la requete ------------------------------- */
            $liste_articles = articles::select("articles.*")
            ->when($libelle_article, fn($query) => $query->where('libelle_article', 'like', "%$libelle_article%"))
            ->when($description, fn($query) => $query->where('description', 'like', "%$description%"))
            ->orderBy($colone, $order);

            $totalRecords = $liste_articles->count(); // le total

            $liste_articles = ($extract_all ? $liste_articles : $liste_articles->skip($skip)->take($take))
            ->get()->map(function($item) {
                $item->_id = Crypt::encryptString($item->id);
                $item->image_article = $item->image && File::exists(public_path('storage/article/' . $item->image))
                ? asset('storage/article/' . $item->image)
                : null; 
                $item->created_at_formated = date('d-m-Y H:i', strtotime($item->created_at));
                $item->updated_at_formated = $item->updated_at? date('d-m-Y H:i', strtotime($item->updated_at)): null;
                return $item;
            });

            return $this->success([
                "data" => $liste_articles,
                "totalRecords" => $totalRecords,
            ]);
        } catch (Exception | QueryException $error) {
            return $this->error(["error" => $error->getMessage()]);
        }
    }

    public function AjouterArticle(Request $request)
    {
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'libelle_article' => 'required|string|max:255',
                'file_extension'      => 'required',
                'copie_multimedia'    => 'required'
            ]);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);

            $id_user_createur = Auth::user()->id;
            $file             = file_get_contents($request->input('copie_multimedia'));
            $file_extension   = trim($request->input('file_extension'));
            $libelle_article = helpers::handleValue($request->input('libelle_article'));
            $description = helpers::handleValue($request->input('description'));

            /* --------------------------------- ajouter -------------------------------- */
            $article = articles::create([
                'libelle_article' => $libelle_article,
                'description'         => $description,
            ]);

            if (! $article->save()) {
                return $this->api_message("error_ajout", ["title" => "articles non ajouté"]);
            }

            /* --------------------------------- upload --------------------------------- */
            $file_name        = $article->id.'-'.date("Y_m_d_H_i_s_s") . ".$file_extension";
            $article->update([
                'image'   => $file_name
            ]);

            if (! helpers::moveFile("article/$file_name", $file, 'public')) {
                DB::rollBack();
                return $this->api_message('error_ajout', ["title" => "Article non ajouté"]);
            }

            /* -------------------------------------------------------------------------- */
            $description_log = "Ajoute d'un nouvel article : ID" . $article->id;
            helpers::Log_action('fournisseurs', $id_user_createur, "Ajoute d'un nouvel article", $description_log);
            DB::commit();
            return $this->success();
        } catch (Exception | QueryException $error) {
            DB::rollBack();
            return $this->error(["error" => $error->getMessage()]);
        }
    }

    public function ModifierArticle(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                '_id' => 'required',
                'libelle_article' => 'required|string|max:255',
            ]);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);

            $_id = Crypt::decryptString($request->input('_id'));
            $id_user_createur = Auth::user()->id;

            $article = articles::find($_id);
            $old_value = clone $article;
            $article = $article->update([
                'libelle_article' => helpers::handleValue($request->input('libelle_article')),
                'description'         => helpers::handleValue($request->input('description')),
            ]);

            if (!$article) {
                return $this->api_message("error_update", ["title" => "Article non modifié"]);
            }

            /* -------------------------------------------------------------------------- */
            $description_log = "Modification de l'article : ID" . $_id;
            helpers::Log_action('fournisseurs', $id_user_createur, "Modification d'un article", $description_log, [
                'old_value' => $old_value,
                'new_value' => $article,
            ]);

            return $this->success();
        } catch (Exception | QueryException $error) {
            return $this->error(["error" => $error->getMessage()]);
        }
    }

    public function SupprimerArticle(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                '_id' => 'required',
            ]);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);
            $_id = Crypt::decryptString($request->input('_id'));
            $id_user_createur = Auth::user()->id;
            $article = articles::find($_id);

            /* ------------------------------ delete image ------------------------------ */
            if ($article->image)
            {
                /* ----------------------------- delete old file ---------------------------- */
                if(File::exists(storage_path("app/public/article/$article->image")))
                {
                    Storage::disk('public')->delete("article/$article->image");
                }
            }

            /* ---------------------------------- save ---------------------------------- */
            $old_value = clone $article;
            if (!$article->delete()) return $this->api_message("error_delete", ["title" => "Article non supprimé"]);

            /* -------------------------------------------------------------------------- */
            $description_log = "Suppression de l'article : ID" . $_id;
            helpers::Log_action('fournisseurs', $id_user_createur, "Suppression d'un article", $description_log, [
                'old_value' => $old_value,
                'new_value' => $article,
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
            $article = articles::find($_id);

            if ($article->image)
            {
                /* ----------------------------- delete old file ---------------------------- */
                if(File::exists(storage_path("app/public/article/$article->image")))
                {
                    Storage::disk('public')->delete("article/$article->image");
                }
                $article->image = null; // Reset the image field
            }

            /* ------------------------- add image to repository ------------------------ */
            if(!helpers::moveFile("article/$file_name",$file,'public'))
            {
                DB::rollBack();
                return $this->api_message('file_error');
            }
            $article->image = $file_name;
            $article->save();
            /* -------------------------------------------------------------------------- */
            $description_log = "Ajout d'une nouvelle image à l'article avec l'identifiant : $_id dans la base de données.";
            helpers::Log_action('fournisseurs', $id_user_createur, "Ajout d'une image à l'article", $description_log);

            DB::commit();
            return $this->success();
        } catch (Exception | QueryException $error)  {
            DB::rollBack();
            return $this->error(["erreur" => $error]);
        }
    }
}
