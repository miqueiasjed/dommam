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
        Schema::create('webhooks_log', function (Blueprint $table) {
            $table->id();
            $table->string('evento');
            $table->json('payload');
            $table->enum('status', ['pendente', 'processado', 'erro'])->default('pendente');
            $table->text('erro_mensagem')->nullable();
            $table->timestamp('processado_em')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('evento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhooks_log');
    }
};
