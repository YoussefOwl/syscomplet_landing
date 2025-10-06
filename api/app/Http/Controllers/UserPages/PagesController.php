<?php
namespace App\Http\Controllers\UserPages;

use App\Http\Controllers\Controller;
use App\Models\articles\articles;
use App\Models\configurations\contenus;
use App\Models\Fournisseurs\fournisseurs;
use App\Models\Marques\marques;
use App\Models\partenaires\partenaires;
use App\Traits\Globlal\ErrorHandling;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use PHPUnit\Exception;

class PagesController extends Controller
{
    use ErrorHandling;
    public function landingPage()
    {
        try {
            $contenus     = $this->contenusPage('landing_page');
            $headerFooter = $this->headerFooter();
            $parenaires   = $this->parenairesPage();
            $fournisseurs = $this->fournisseursPage();
            $articles     = $this->articlesPage(true);
            $header       = $headerFooter->where('page_position', 'header');
            $body         = $contenus->where('page_position', 'body');
            $footer       = $headerFooter->where('page_position', 'footer');
            $supportedDevises      = $this->marquesPage();
            return view('body.landing-page', [
                'header'       => $header,
                'body'         => $body,
                'articles'     => $articles,
                'parenaires'   => $parenaires,
                'fournisseurs' => $fournisseurs,
                'footer'       => $footer,
                'supportedDevises'      => $supportedDevises
            ]);
        } catch (Exception | QueryException $error) {
            return $this->error(['erreur' => $error]);
        }
    }

    public function aboutUs()
    {
        try {
            $contenus = $this->contenusPage('about');
            $body     = [];
            foreach ($contenus->where('page_position', 'body') as $item) {
                $body[$item->html_id] = $item->description_fr;
            }
            $footer = $this->headerFooter(["footer"]);

            return view('body.about_us', [
                'body'   => ((object) $body),
                'footer' => $footer,
            ]);
        } catch (Exception | QueryException $error) {
            return $this->error(['erreur' => $error]);
        }
    }

    public function articles()
    {
        try {
            $liste_articles = $this->articlesPage();
            $contenusPage = $this->contenusPage("articles");
            $footer         = $this->headerFooter(["footer"]);
            return view('body.articles_grid', [
                'articles' => $liste_articles,
                "contenusPage" => $contenusPage,
                'footer'   => $footer,
            ]);
        } catch (Exception | QueryException $error) {
            return $this->error(['erreur' => $error]);
        }
    }

    public function politiques()
    {
        try {
            $contenu = $this->contenusPage("privacy")->where('html_id', 'bloc_politique')?->first()?->description_fr;
            $footer  = $this->headerFooter(["footer"]);
            return view('body.politique', [
                'contenu' => $contenu,
                'footer'  => $footer,
            ]);
        } catch (Exception | QueryException $error) {
            return $this->error(['erreur' => $error]);
        }
    }

    public function termes()
    {
        try {
            $contenu = $this->contenusPage("terms")->where('html_id', 'bloc_terms')?->first()?->description_fr;
            $footer  = $this->headerFooter(["footer"]);
            return view('body.termes', [
                'contenu' => $contenu,
                'footer'  => $footer,
            ]);
        } catch (Exception | QueryException $error) {
            return $this->error(['erreur' => $error]);
        }
    }

    public function demandeDemoPage() 
    {
        try {
            $footer  = $this->headerFooter(["footer"]);
            return view('body.demande-demo', [
                'footer'  => $footer,
            ]);
        }
        catch (Exception | QueryException $error) {
            return $this->error(['erreur' => $error]);
        }
    }

    private function contenusPage($page)
    {
        return contenus::where('page', $page)
            ->whereIn('page_position', ['body'])
            ->orderBy('html_id', 'asc')
            ->get()
            ->map(function ($item) {
                $item->image = File::exists(public_path('storage/contenus/' . $item->image))
                ? asset('storage/contenus/' . $item->image)
                : null;
                return $item;
            });
    }

    private function headerFooter($page_position = ['header', 'footer'])
    {
        return contenus::where('page', 'landing_page')
            ->whereIn('page_position', $page_position)
            ->orderBy('html_id', 'asc')
            ->get()
            ->map(function ($item) {
                $item->image = File::exists(public_path('storage/contenus/' . $item->image))
                ? asset('storage/contenus/' . $item->image)
                : null;
                return $item;
            });
    }

    private function parenairesPage()
    {
        return partenaires::select("libelle_partenaire", "logo_partenaire")
            ->whereNull('partenaires.deleted_at')
            ->orderBy('libelle_partenaire', 'asc')
            ->get()->map(function ($partenaire) {
            $partenaire->logo_partenaire = File::exists(public_path('storage/partenaires/' . $partenaire->logo_partenaire))
            ? asset('storage/partenaires/' . $partenaire->logo_partenaire)
            : null;
            return $partenaire;
        });
    }

    private function fournisseursPage()
    {
        return fournisseurs::select("fournisseurs.*")
            ->get()
            ->map(function ($fournisseur) {
                $fournisseur->image_fournisseur = $fournisseur->image_fournisseur && File::exists(public_path('storage/fournisseur/' . $fournisseur->image_fournisseur))
                ? asset('storage/fournisseur/' . $fournisseur->image_fournisseur)
                : null;
                return $fournisseur;
            });
    }

    private function articlesPage($limit = false)
    {
        return articles::select("articles.*")
            ->when($limit, fn($query) => $query->limit(4))
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($item) {
                $item->image_article = $item->image && File::exists(public_path('storage/article/' . $item->image))
                ? asset('storage/article/' . $item->image)
                : null;
                $item->created_at_formated = date('d-m-Y H:i', strtotime($item->created_at));
                $item->updated_at_formated = $item->updated_at ? date('d-m-Y H:i', strtotime($item->updated_at)) : null;
                return $item;
            });
    }

    private function marquesPage()
    {
        return marques::get()
            ->map(function ($item) {
                $item->image_marque = $item->image && File::exists(public_path('storage/marque/' . $item->image))
                ? asset('storage/marque/' . $item->image)
                : null;
                $item->created_at_formated = date('d-m-Y H:i', strtotime($item->created_at));
                $item->updated_at_formated = $item->updated_at ? date('d-m-Y H:i', strtotime($item->updated_at)) : null;
                return $item;
            });
    }
}
