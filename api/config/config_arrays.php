<?php
return [
    "liste_type_societe" => [
        ["value" => 1, "label" => "Particulier"],
        ["value" => 2, "label" => "Entreprise"],
    ],
    "liste_autorisations" => [
        ["value" => 1, "label" => "Autorisé", "badge" => "bg-success", 'is_autorised' => true],
        ["value" => 2, "label" => "Non autorisé", "badge" => "bg-danger", 'is_autorised' => false],
    ],
    "liste_sujet_contact" => [
        ['value' => 1, 'label' => 'Demande de renseignements généraux'],
        ['value' => 2, 'label' => 'Demande de devis ou d\'une demo'],
        ['value' => 3, 'label' => 'Réclamations et feedback'],
        ['value' => 4, 'label' => 'Demandes commerciales'],
        ['value' => 5, 'label' => 'Assistance technique'],
        ['value' => 6, 'label' => 'Modification de commande'],
        ['value' => 7, 'label' => 'Autres demandes'],
    ],
    "liste_status_contact" => [
        ["value" => 1, "label" => "En cours", "badge" => "bg-orange", 'is_finished' => false],
        ["value" => 2, "label" => "Terminé", "badge" => "bg-success", 'is_finished' => true],
    ],
    "liste_pages" => [
        ['value' => 'landing_page', 'label' => "Page d'accueil"],
        ['value' => 'about', 'label' => 'À propos'],
        ['value' => 'contact', 'label' => 'Contact'],
        ['value' => 'faq', 'label' => 'FAQ'],
        ['value' => 'terms', 'label' => 'Conditions générales'],
        ['value' => 'privacy', 'label' => 'Politique de confidentialité'],
    ],
    "liste_page_positions" => [
        ['value' => 'header', 'label' => 'En-tête'],
        ['value' => 'body', 'label' => 'Corps de page'],
        ['value' => 'footer', 'label' => 'Pied de page'],
    ]
];