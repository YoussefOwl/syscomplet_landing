<?php
namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    protected $namespace = 'App\Http\Controllers';
    public function boot()
    {
        parent::boot();
    }
    public function map()
    {
        $this->mapWebRoutes();
        $this->mapApiRoutes();
        $this->mapApiUserRoutes();
        $this->mapApiConfigurationRoutes();
        $this->mapApiPartenairesRoutes();
        $this->mapApiNewsletterRoutes();
        $this->mapApiFournisseurRoutes();
        $this->mapApiArticlesRoutes();
        $this->mapApiMarquesRoutes();
    }
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }
    protected function mapApiRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }
    protected function mapApiUserRoutes()
    {
        Route::prefix('api_user')
            ->middleware('api_user')
            ->namespace($this->namespace)
            ->group(base_path('routes/api_user.php'));
    }
    protected function mapApiConfigurationRoutes()
    {
        Route::prefix('api_configurations')
            ->middleware('api_configurations')
            ->namespace($this->namespace)
            ->group(base_path('routes/api_configurations.php'));
    }
    protected function mapApiPartenairesRoutes()
    {
        Route::prefix('api_partenaire')
            ->middleware('api_partenaire')
            ->namespace($this->namespace)
            ->group(base_path('routes/api_partenaire.php'));
    }
    protected function mapApiNewsletterRoutes()
    {
        Route::prefix('api_newsletter')
            ->middleware('api_newsletter')
            ->namespace($this->namespace)
            ->group(base_path('routes/api_newsletter.php'));
    }
    protected function mapApiFournisseurRoutes()
    {
        Route::prefix('api_fournisseurs')
            ->middleware('api_fournisseurs')
            ->namespace($this->namespace)
            ->group(base_path('routes/api_fournisseurs.php'));
    }
    protected function mapApiArticlesRoutes()
    {
        Route::prefix('api_articles')
            ->middleware('api_articles')
            ->namespace($this->namespace)
            ->group(base_path('routes/api_articles.php'));
    }
    protected function mapApiMarquesRoutes()
    {
        Route::prefix('api_marques')
            ->middleware('api_marques')
            ->namespace($this->namespace)
            ->group(base_path('routes/api_marques.php'));
    }
}
