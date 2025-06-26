<?php
use App\Http\Controllers\UserPages\PagesController;
use App\Models\helpers;
use Illuminate\Support\Facades\Route;
/* --------------------------- Api sans middleware -------------------------- */
Route::get('/', [PagesController::class, 'landingPage']);
Route::group(['middleware' => 'jwt.verify'], function () use ($router) {
    /* -------------------------------------------------------------------------- */
    /*                            les apis des articles                           */
    /* -------------------------------------------------------------------------- */
    $router->post('AfficherArticle', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_articles'),
        'uses' => 'Articles\ArticleController@AfficherArticle',
    ]);
    $router->post('AjouterArticle', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_articles'),
        'uses' => 'Articles\ArticleController@AjouterArticle',
    ]);
    $router->post('ModifierArticle', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_articles'),
        'uses' => 'Articles\ArticleController@ModifierArticle',
    ]);
    $router->post('SupprimerArticle', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_articles'),
        'uses' => 'Articles\ArticleController@SupprimerArticle',
    ]);
    /* ------------------------------- ManageImage ------------------------------ */
    $router->post('ManageImage', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_articles'),
        'uses' => 'Articles\ArticleController@ManageImage',
    ]);
});