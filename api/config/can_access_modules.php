<?php
return array(
    /* -------------------------------------------------------------------------- */
    /*                   les droits d'accèss aux modules angular                  */
    /* -------------------------------------------------------------------------- */
    array(
        'key' => "can_access_configurations",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
        ],
    ),
    array(
        'key' => "can_access_partenaires",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ),
    array(
        'key' => "can_access_contenus",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ),
    array(
        'key' => "can_access_contacts",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ),
    array(
        'key' => "can_access_newsletters",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ),
    array(
        'key' => "can_access_fournisseurs",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ),
    array(
        'key' => "can_access_articles",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ),
    array(
        'key' => "can_access_marques",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ),
    array(
        'key' => "can_access_demande_demo",
        'value' => [
            md5(base64_encode(intval(env('identifiant_role_admin')))),
            md5(base64_encode(intval(env('identifiant_role_manager')))),
        ],
    ),
);
