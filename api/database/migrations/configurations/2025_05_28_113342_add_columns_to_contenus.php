<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contenus', function (Blueprint $table) {
            $table->string('page')->after('description_ar')->nullable();
            $table->string('page_position')->after('description_ar')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('contenus', function (Blueprint $table) {
            $table->dropColumn('page');
            $table->dropColumn('page_position');
        });
    }
};
