<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
            $table->bigIncrements('id');
            $table->integer('sujet_contact');
            $table->integer('status_contact')->default(1);
            $table->string('email_contact',255);
            $table->string('first_and_last_name',255);
            $table->string('adresse_ip',255); // $_SERVER['REMOTE_ADDR']
            $table->date('date_contact');
            $table->longText('message_contact');
            $table->timestamps();
            /* ---------------------------- Les clés uniques ---------------------------- */
            $table->unique(['date_contact','email_contact'],'uk_contact_1');
            $table->unique(['date_contact','first_and_last_name'],'uk_contact_2');
            $table->unique(['date_contact','email_contact','adresse_ip'],'uk_contact_3');
            $table->unique(['date_contact','first_and_last_name','adresse_ip'],'uk_contact_4');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
