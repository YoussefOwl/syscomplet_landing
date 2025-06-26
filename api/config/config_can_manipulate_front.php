<?php
return array(
    /* -------------------------------------------------------------------------- */
    /*                        les droits d'accèss aux apis                        */
    /* -------------------------------------------------------------------------- */
    /* ---------------------------- Gestion des rôles --------------------------- */
    array(
        'key' => "if_can_manage_roles",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin'))))
        ]
    ),
);