<?php
/* --------------------------- Api sans middleware -------------------------- */

use App\Http\Controllers\UserPages\PagesController;
use App\Models\helpers;
use Illuminate\Support\Facades\Route;

Route::get('/', [PagesController::class, 'landingPage']);
Route::group(['middleware' => 'jwt.verify'], function () use ($router) {
    $router->post('AfficherFournisseur', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_fournisseurs'),
        'uses' => 'Fournisseur\FournisseurController@AfficherFournisseur',
    ]);
    $router->post('AjouterFournisseur', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_fournisseurs'),
        'uses' => 'Fournisseur\FournisseurController@AjouterFournisseur',
    ]);
    $router->post('ModifierFournisseur', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_fournisseurs'),
        'uses' => 'Fournisseur\FournisseurController@ModifierFournisseur',
    ]);
    $router->post('SupprimerFournisseur', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_fournisseurs'),
        'uses' => 'Fournisseur\FournisseurController@SupprimerFournisseur',
    ]);
    $router->post('ManageImage', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_fournisseurs'),
        'uses' => 'Fournisseur\FournisseurController@ManageImage',
    ]);
});