<?php
return [
    /* -------------------------------------------------------------------------- */
    /*                        les droits d'accèss aux apis                        */
    /* -------------------------------------------------------------------------- */
    /* ------------------------------ Apis globales ----------------------------- */
    [
        'key'   => "group_roles_for_api",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ],
    /* --------------------------- Affichage des logs --------------------------- */
    [
        'key'   => "group_roles_for_view_api_logs",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ],
    /* ---------------------------- Gestion des Rôles --------------------------- */
    [
        'key'   => "group_roles_for_api_roles_view",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
        ],
    ],
    [
        'key'   => "group_roles_for_api_roles_manage",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
        ],
    ],
    /* ------------------------ Gestion des Utilisateurs ------------------------ */
    [
        'key'   => "group_roles_for_api_user",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
        ],
    ],
    /* ---------------------------- Gestion du compte --------------------------- */
    [
        'key'   => "group_roles_for_api_manage_account",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ],
    /* ---------------- Les rôles qui peuvent ajouter des admins ---------------- */
    [
        'key'   => "group_roles_can_add_users_admins",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
        ],
    ],
    /* ----------------------- La gestion des partenaires ---------------------- */
    [
        'key'   => "group_roles_for_partenaires",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ],
    /* --------------------------------- Villes --------------------------------- */
    [
        'key'   => "group_roles_for_api_villes",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
        ],
    ],
    /* --------------------------- Gestion de contenus -------------------------- */
    [
        'key'   => "group_roles_for_api_contenu",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ],
    /* -------------------------------------------------------------------------- */
    /*                      Gestion des demandes de contacts                      */
    /* -------------------------------------------------------------------------- */
    [
        'key'   => "group_roles_for_api_contacts",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ],
    /* ----------------------- La gestion des newsletters ---------------------- */
    [
        'key'   => "group_roles_for_newsletters",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ],
    /* -------------------------------------------------------------------------- */
    /*                                fournisseurs                                */
    /* -------------------------------------------------------------------------- */
    [
        'key'   => "group_roles_for_fournisseurs",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ],
    /* -------------------------------------------------------------------------- */
    /*                                  articles                                  */
    /* -------------------------------------------------------------------------- */
    [
        'key'   => "group_roles_for_articles",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ],
    /* -------------------------------------------------------------------------- */
    /*                                   marque                                   */
    /* -------------------------------------------------------------------------- */
    [
        'key'   => "group_roles_for_marques",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ],
    [
        'key'   => "group_roles_for_demande_demo",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ]
];
