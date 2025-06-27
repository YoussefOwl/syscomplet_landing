<?php

use App\Http\Controllers\UserPages\DemandeController;
use App\Http\Controllers\UserPages\PagesController;
use Illuminate\Support\Facades\Route;
Route::get('/', [PagesController::class, 'landingPage'])->name('landing-page');
Route::get('/about_us', [PagesController::class, 'aboutUs'])->name('about-us');
Route::get('/articles', [PagesController::class, 'articles'])->name('articles');
Route::get('/politiques', [PagesController::class, 'politiques'])->name('politiques');
Route::get('/termes', [PagesController::class, 'termes'])->name('termes');
Route::get('/demande-demo', [PagesController::class, 'demandeDemoPage'])->name('demande-demo');
Route::post('/demande_demo_store', [DemandeController::class, 'store'])->name('demande_demo_store');
