<?php

use App\Http\Controllers\UserPages\PagesController;
use App\Models\helpers;
use Illuminate\Support\Facades\Route;
Route::get('/', [PagesController::class, 'landingPage']);
Route::group(['middleware' => 'jwt.verify'], function () use ($router) {
    /* -------------------------------------------------------------------------- */
    /*                            les apis des articles                           */
    /* -------------------------------------------------------------------------- */
    $router->post('afficherDemandesDemo', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_demande_demo'),
        'uses' => 'UserPages\DemandeController@afficherDemandesDemo',
    ]);
    $router->post('marqueVuDemandesDemo', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_demande_demo'),
        'uses' => 'UserPages\DemandeController@marqueVuDemandesDemo',
    ]);
});