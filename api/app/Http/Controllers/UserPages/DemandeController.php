<?php

namespace App\Http\Controllers\UserPages;

use App\Http\Controllers\Controller;
use App\Models\contacts\demande_demo;
use App\Models\helpers;
use App\Traits\Globlal\ErrorHandling;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Util\Exception;

class DemandeController extends Controller
{
    use ErrorHandling;
    public function afficherDemandesDemo(Request $request) {
        try {
            /* ------------------------------ les variables ----------------------------- */
            $skip = $request->post('skip') ? intval($request->post('skip')) : 0;
            $take = $request->post('take') ? intval($request->post('take')) : 10;
            $colone = $request->post('colone') ? $request->post('colone') : "id";
            $order = $request->post('order') ? $request->post('order') : "asc";
            $extract_all = $request->post('extract_all') === true;
    
            /* -------------------------------- variables ------------------------------- */
            $date_debut = helpers::handleValue($request->post('date_debut'));
            $date_fin = helpers::handleValue($request->post('date_fin'));
            $nom_demandeur = helpers::handleValue($request->post('nom_demandeur'));
            $email_demandeur = helpers::handleValue($request->post('email_demandeur'));
            $phone_demandeur = helpers::handleValue($request->post('phone_demandeur'));
            $entreprise_demandeur = helpers::handleValue($request->post('entreprise_demandeur'));
            $etat = boolval($request->post('etat'));
    
            /* ------------------------------ les requetes ----------------------------- */
            $liste_demande_demo = demande_demo::when($date_debut, fn ($query) => $query->whereRaw("DATE_FORMAT(created_at, '%Y-%m-%d') >= ?", [$date_debut]))
            ->when($date_debut, fn ($query) => $query->whereRaw("DATE_FORMAT(created_at, '%Y-%m-%d') <= ?", [$date_fin]))
            ->when($nom_demandeur, fn ($query) => $query->where('nom_demandeur', 'like', "%$nom_demandeur%"))
            ->when($email_demandeur, fn ($query) => $query->where('email_demandeur', 'like', "%$email_demandeur%"))
            ->when($phone_demandeur, fn ($query) => $query->where('phone_demandeur', 'like', "%$phone_demandeur%"))
            ->when($entreprise_demandeur, fn ($query) => $query->where('entreprise_demandeur', 'like', "%$entreprise_demandeur%"))
            ->when($etat !== null, fn ($query) => $query->where('vu', $etat))
            ->orderBy($colone, $order);
    
            $totalRecords = $liste_demande_demo->count(); // le total
    
            $liste_demande_demo = ($extract_all ? $liste_demande_demo : $liste_demande_demo->skip($skip)->take($take))
            ->get()
            ->map(function($item) {
                $item->_id = Crypt::encryptString($item->id);
                $item->date_demande = date("d-m-Y H:i",strtotime($item->created_at));
                $item->etat = $item->vu ? "Traité" : "En cours";
                $item->vu = boolval($item->vu);
                return $item;
            });
    
            return $this->success([
                "data" => $liste_demande_demo,
                "totalRecords" => $totalRecords
            ]);
        } catch (Exception | QueryException $exp) {
            return $this->error(['erreur' => $exp]);
        }
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
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Assuming you have a model named DemandeDemo
        demande_demo::create([
            "nom_demandeur" => $nom_demandeur,
            "email_demandeur" => $email_demandeur,
            "phone_demandeur" => $phone_demandeur,
            "entreprise_demandeur" => $entreprise_demandeur,
            "message_demandeur" => $message_demandeur
        ]);

        return redirect()->back()->with('success', 'Demande soumise avec succès');
    }

    public function marqueVuDemandesDemo(Request $request) {
        try {
            $validator = Validator::make($request->all(), ['_id' => 'required']);
            if ($validator->fails()) return $this->api_message(data: [$validator->errors()]);
            
            $id = Crypt::decryptString($request->input('_id'));

            $demande = demande_demo::find($id);
            $demande->vu = true;
            $demande->save();

            return $this->success(['message' => 'Demande marked as viewed successfully']);
        } catch (Exception | QueryException $exp) {
            return $this->error(['erreur' => $exp]);
        }
    }
}
