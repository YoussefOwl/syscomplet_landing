<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('partenaires', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            /* ------------------------- les champs obligatoires ------------------------ */
            $table->bigIncrements('id');
            $table->string('libelle_partenaire', 255)->unique();
            $table->integer('id_ville')->nullable();
            $table->integer('autorisation_partenaire')->nullable();
            $table->integer('type_societe_partenaire')->nullable();
            $table->string('telephone_partenaire', 50)->nullable();
            $table->string('email_partenaire', 80)->nullable();
            $table->string('ice_partenaire', 100)->nullable();
            $table->string('fax_partenaire', 50)->nullable();
            $table->string('registre_commerce_partenaire', 100)->nullable(); // RC
            $table->string('identifiant_fiscal_partenaire', 100)->nullable(); // IF
            $table->string('rib_partenaire', 100)->nullable();
            $table->text('adresse_partenaire')->nullable();
            $table->text('description')->nullable();
            /* ----------------------------- le responsable ----------------------------- */
            $table->string('responsable_nom_complet', 50)->nullable();
            $table->string('responsable_telephone', 50)->nullable();
            $table->string('responsable_email', 80)->nullable();
            $table->text('logo_partenaire')->nullable(); // le chemin de l'image
            $table->timestamps();
            $table->softDeletes();
        });
}

    public function down()
    {
        Schema::dropIfExists('partenaires');
    }
};
