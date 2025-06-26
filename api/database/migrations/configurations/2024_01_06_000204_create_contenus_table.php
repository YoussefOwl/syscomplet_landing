<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contenus', function (Blueprint $table) {
            $table->id();
            $table->string('html_id', 250)->unique();
            $table->longText('description_fr')->nullable();
            $table->longText('description_ar')->nullable();
            $table->string('class')->nullable();
            $table->text('image')->nullable();
            $table->text('autre')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contenus');
    }
};
