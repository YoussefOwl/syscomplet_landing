<?php

use App\Http\Controllers\UserPages\PagesController;
use App\Models\helpers;
use Illuminate\Support\Facades\Route;
Route::get('/', [PagesController::class, 'landingPage']);
Route::group(['middleware' => 'jwt.verify'], function () use ($router) {
    /* -------------------------------------------------------------------------- */
    /*                             Les apis des villes                            */
    /* -------------------------------------------------------------------------- */
    $router->post('AfficherVille', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_villes'),
        'uses' => 'Villes\VillesController@AfficherVille',
    ]);
    $router->post('AjouterVille', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_villes'),
        'uses' => 'Villes\VillesController@AjouterVille',
    ]);
    $router->post('SupprimerVille', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_villes'),
        'uses' => 'Villes\VillesController@SupprimerVille',
    ]);
    $router->post('ModifierVille', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_villes'),
        'uses' => 'Villes\VillesController@ModifierVille',
    ]);
    $router->post('RestaurerVille', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_villes'),
        'uses' => 'Villes\VillesController@RestaurerVille',
    ]);
    $router->post('RestaurerVille', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_villes'),
        'uses' => 'Villes\VillesController@RestaurerVille',
    ]);
    /* -------------------------------------------------------------------------- */
    /*                       Les apis de gestion de contenus                      */
    /* -------------------------------------------------------------------------- */
    $router->post('AfficherContenusAdmins', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_contenu'),
        'uses' => 'Contenus\ContenusController@AfficherContenusAdmins',
    ]);
    $router->post('ModifierContenu', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_contenu'),
        'uses' => 'Contenus\ContenusController@ModifierContenu',
    ]);
    $router->post('AjouterContenus', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_contenu'),
        'uses' => 'Contenus\ContenusController@AjouterContenus',
    ]);
    $router->post('ManageImage', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_contenu'),
        'uses' => 'Contenus\ContenusController@ManageImage',
    ]);
    $router->post('SupprimerImage', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_contenu'),
        'uses' => 'Contenus\ContenusController@SupprimerImage',
    ]);
    /* -------------------------------------------------------------------------- */
    /*                      Gestion des demandes de contacts                      */
    /* -------------------------------------------------------------------------- */
    $router->post('AfficherContactsAdmins', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_contacts'),
        'uses' => 'Contacts\ContactsController@AfficherContactsAdmins',
    ]);
    $router->post('ModifierContacts', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_contacts'),
        'uses' => 'Contacts\ContactsController@ModifierContacts',
    ]);
}); // fin Route group
