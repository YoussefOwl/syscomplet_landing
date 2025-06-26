<?php

use App\Http\Controllers\UserPages\PagesController;
use App\Models\helpers;
use Illuminate\Support\Facades\Route;
/* --------------------------- Api sans middleware -------------------------- */
Route::get('/', [PagesController::class, 'landingPage']);
Route::group(['middleware' => 'jwt.verify'], function () use ($router) {
    /* -------------------------------------------------------------------------- */
    /*                          les apis des newsletters                         */
    /* -------------------------------------------------------------------------- */
    $router->post('AfficherNewslettersAdmins', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_newsletters'),
        'uses' => 'Newsletters\NewslettersController@AfficherNewslettersAdmins',
    ]);
    $router->post('SupprimerNewsletter', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_newsletters'),
        'uses' => 'Newsletters\NewslettersController@SupprimerNewsletter',
    ]);
}); // fin Route group
