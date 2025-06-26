<?php

use App\Http\Controllers\UserPages\PagesController;
use App\Models\helpers;
use Illuminate\Support\Facades\Route;
Route::get('/', [PagesController::class, 'landingPage']);
Route::post('LoginUtilisateur', ['uses' => 'Utilisateur\UserController@LoginUtilisateur']);
Route::group(['middleware' => 'jwt.verify'], function () use ($router) {
    /* -------------------------------------------------------------------------- */
    /*                          Api pour les utilisateurs                         */
    /* -------------------------------------------------------------------------- */
    // le nom de la route par example ici AfficherUtilisateur <=> URL/api/AfficherUtilisateur
    $router->post('AfficherUtilisateur', [
        'middleware' => 'jwt.role', // middleware spécifique de la route
        'roles' => helpers::getRoleValue('group_roles_for_api_user'), // les rôles autorisé d'utiliser la route
        'uses' => 'Utilisateur\UserController@AfficherUtilisateur', // Nom_controlleur@methode_dans_le_controleur
    ]);
    $router->post('SupprimerUtilisateur', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_user'),
        'uses' => 'Utilisateur\UserController@SupprimerUtilisateur',
    ]);
    $router->post('SupprimerUtilisateur', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_user'),
        'uses' => 'Utilisateur\UserController@SupprimerUtilisateur',
    ]);
    $router->post('AjouterUtilisateur', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_user'),
        'uses' => 'Utilisateur\UserController@AjouterUtilisateur',
    ]);
    $router->post('ModifierParmsUtilisateur', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_user'),
        'uses' => 'Utilisateur\UserController@ModifierParmsUtilisateur',
    ]);
    $router->post('RestaurerUser', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_user'),
        'uses' => 'Utilisateur\UserController@RestaurerUser',
    ]);
    /* -------------------------------------------------------------------------- */
    /*                               SELF MANEGEMENT                              */
    /* -------------------------------------------------------------------------- */
    $router->post('ModifierUtilisateur', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_manage_account'),
        'uses' => 'Utilisateur\UserController@ModifierUtilisateur',
    ]);
    $router->post('ChangePassword', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_manage_account'),
        'uses' => 'Utilisateur\UserController@ChangePassword',
    ]);
    $router->post('GetMyInfo', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_manage_account'),
        'uses' => 'Utilisateur\UserController@GetMyInfo',
    ]);
    $router->post('AfficherMonImage', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_manage_account'),
        'uses' => 'Utilisateur\UserController@AfficherMonImage',
    ]);
    $router->post('ModifierMonImage', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_manage_account'),
        'uses' => 'Utilisateur\UserController@ModifierMonImage',
    ]);
    $router->post('SupprimerMonImage', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_manage_account'),
        'uses' => 'Utilisateur\UserController@SupprimerMonImage',
    ]);
    /* -------------------------------------------------------------------------- */
    /*                             Api pour les rôles                             */
    /* -------------------------------------------------------------------------- */
    $router->post('AfficherRole', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_roles_view'),
        'uses' => 'Roles\RolesController@AfficherRole',
    ]);
    $router->post('AjouterRole', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_roles_manage'),
        'uses' => 'Roles\RolesController@AjouterRole',
    ]);
    $router->post('ModifierRole', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api_roles_manage'),
        'uses' => 'Roles\RolesController@ModifierRole',
    ]);
    /* -------------------------------------------------------------------------- */
    /*                              Les apis des logs                             */
    /* -------------------------------------------------------------------------- */
    $router->post('AfficherLogs', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_view_api_logs'),
        'uses' => 'General\GeneralController@AfficherLogs',
    ]);
}); // fin Route group
