<?php

use App\Http\Controllers\UserPages\PagesController;
use App\Models\helpers;
use Illuminate\Support\Facades\Route;
/* --------------------------- Api sans middleware -------------------------- */
Route::get('/', [PagesController::class, 'landingPage']);
Route::group(['middleware' => 'jwt.verify'], function () use ($router) {
    /* -------------------------------------------------------------------------- */
    /*                            les apis des clients                            */
    /* -------------------------------------------------------------------------- */
    $router->post('AfficherClient', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_clients'),
        'uses' => 'Clients\ClientsController@AfficherClient',
    ]);
    $router->post('RestaurerClient', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_clients'),
        'uses' => 'Clients\ClientsController@RestaurerClient',
    ]);
    $router->post('AjouterClient', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_clients'),
        'uses' => 'Clients\ClientsController@AjouterClient',
    ]);
    $router->post('SupprimerClient', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_clients'),
        'uses' => 'Clients\ClientsController@SupprimerClient',
    ]);
    $router->post('ModifierClient', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_clients'),
        'uses' => 'Clients\ClientsController@ModifierClient',
    ]);
}); // fin Route group
