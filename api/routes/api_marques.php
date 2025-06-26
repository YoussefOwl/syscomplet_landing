<?php
/* --------------------------- Api sans middleware -------------------------- */

use App\Http\Controllers\UserPages\PagesController;
use App\Models\helpers;
use Illuminate\Support\Facades\Route;

Route::get('/', [PagesController::class, 'landingPage']);
Route::group(['middleware' => 'jwt.verify'], function () use ($router) {
    $router->post('AfficherMarque', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_marques'),
        'uses' => 'Marque\MarqueController@AfficherMarque',
    ]);
    $router->post('AjouterMarque', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_marques'),
        'uses' => 'Marque\MarqueController@AjouterMarque',
    ]);
    $router->post('ModifierMarque', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_marques'),
        'uses' => 'Marque\MarqueController@ModifierMarque',
    ]);
    $router->post('SupprimerMarque', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_marques'),
        'uses' => 'Marque\MarqueController@SupprimerMarque',
    ]);
    $router->post('ManageLogo', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_marques'),
        'uses' => 'Marque\MarqueController@ManageLogo',
    ]);
});