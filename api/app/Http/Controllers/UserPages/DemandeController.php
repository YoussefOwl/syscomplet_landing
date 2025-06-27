<?php

namespace App\Http\Controllers\UserPages;

use App\Http\Controllers\Controller;
use App\Models\contacts\demande_demo;
use App\Models\helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DemandeController extends Controller
{
    public function index() {

    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'nom_demandeur' => 'required|string|max:255',
            'email_demandeur' => 'required|email|max:255',
            'phone_demandeur' => 'required|string|max:20'
        ]);

        $nom_demandeur = helpers::handleValue($request->input('nom_demandeur'));
        $email_demandeur = helpers::handleValue($request->input('email_demandeur'));
        $phone_demandeur = helpers::handleValue($request->input('phone_demandeur'));
        $entreprise_demandeur = helpers::handleValue($request->input('entreprise_demandeur'));
        $message_demandeur = helpers::handleValue($request->input('message_demandeur'));

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator->errors())->withInput();
        }

        // Assuming you have a model named DemandeDemo
        demande_demo::create([
            "nom_demandeur" => $nom_demandeur,
            "email_demandeur" => $email_demandeur,
            "phone_demandeur" => $phone_demandeur,
            "entreprise_demandeur" => $entreprise_demandeur,
            "message_demandeur" => $message_demandeur
        ]);

        return redirect()->back()->with('success', 'Demande submitted successfully');
    }
}
