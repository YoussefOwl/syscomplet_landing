<?php

use App\Http\Controllers\UserPages\PagesController;
use App\Models\helpers;
use Illuminate\Support\Facades\Route;
/* --------------------------- Api sans middleware -------------------------- */
Route::get('/', [PagesController::class, 'landingPage']);
Route::get('AfficherTemoignagesFo', ['uses' => 'Clients\ClientsController@AfficherTemoignagesFo']);
Route::get('AfficherContenusFo', [ 'uses' => 'Contenus\ContenusController@AfficherContenusFo']);
Route::get('AfficherPartenaireFO', ['uses' => 'Partenaires\PartenairesController@AfficherPartenaireFO']);
Route::get('AfficherContactsSubjects', ['uses' => 'Contacts\ContactsController@AfficherContactsSubjects']);
Route::post('AjouterContact', ['uses' => 'Contacts\ContactsController@AjouterContact']);
Route::post('AjouterNewsletter', ['uses' => 'Newsletters\NewslettersController@AjouterNewsletter']);
Route::post('TelechargerDocument', [ 'uses' => 'General\GeneralController@TelechargerDocument']);
/* -------------------------------------------------------------------------- */
/*                            Les api générales                               */
/* -------------------------------------------------------------------------- */
Route::group(['middleware' => 'jwt.verify'], function () use ($router) {
   
    $router->post('LoadParamsForList', [
        'middleware' => 'jwt.role',
        'roles' => helpers::getRoleValue('group_roles_for_api'),
        'uses' => 'General\GeneralController@LoadParamsForList',
    ]);
}); // fin Route group