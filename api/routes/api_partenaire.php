<?php

use App\Http\Controllers\UserPages\PagesController;
use App\Models\helpers;
use Illuminate\Support\Facades\Route;
/* --------------------------- Api sans middleware -------------------------- */
Route::get('/', [PagesController::class, 'landingPage']);
Route::group(['middleware' => 'jwt.verify'], function () use ($router) {
    /* -------------------------------------------------------------------------- */
    /*                          les apis des partenaires                         */
    /* -------------------------------------------------------------------------- */
    $router->post('AfficherPartenaires', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_partenaires'),
        'uses' => 'Partenaires\PartenairesController@AfficherPartenaires',
    ]);
    $router->post('RestaurerPartenaire', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_partenaires'),
        'uses' => 'Partenaires\PartenairesController@RestaurerPartenaire',
    ]);
    $router->post('AjouterPartenaire', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_partenaires'),
        'uses' => 'Partenaires\PartenairesController@AjouterPartenaire',
    ]);
    $router->post('SupprimerPartenaire', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_partenaires'),
        'uses' => 'Partenaires\PartenairesController@SupprimerPartenaire',
    ]);
    $router->post('ModifierPartenaire', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_partenaires'),
        'uses' => 'Partenaires\PartenairesController@ModifierPartenaire',
    ]);
    /* -------------------------------------------------------------------------- */
    /*                       Les apis upload Logo_partenaire                     */
    /* -------------------------------------------------------------------------- */
    $router->post('ModifierImagePartenaire', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_partenaires'),
        'uses' => 'Partenaires\PartenairesController@ModifierImagePartenaire',
    ]);
    $router->post('SupprimerImagePartenaire', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_partenaires'),
        'uses' => 'Partenaires\PartenairesController@SupprimerImagePartenaire',
    ]);
}); // fin Route group
