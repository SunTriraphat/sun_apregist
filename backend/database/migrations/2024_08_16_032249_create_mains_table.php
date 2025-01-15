<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mains', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('model');
            $table->string('dealer_code');
            $table->string('account');
            $table->string('vin');
            $table->string('stock');
            $table->date('date_recieved');
            $table->date('date_accounted_sent');
            $table->date('date_accounted');
            $table->string('status');
            $table->string('document');
            $table->decimal('price', total:8, places:2);
            $table->string('billing');
            $table->date('date_payment');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mains');
    }
};
