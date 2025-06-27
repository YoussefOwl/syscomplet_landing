<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demande_demo', function (Blueprint $table) {
            $table->id();
            $table->string('nom_demandeur');
            $table->string('email_demandeur');
            $table->string('phone_demandeur');
            $table->string('entreprise_demandeur')->nullable();
            $table->string('vu')->default(0);
            $table->text('message_demandeur')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demande_demo');
    }
};
