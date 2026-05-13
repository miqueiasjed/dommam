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
        Schema::create('roteiros', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('slug')->unique();
            $table->text('descricao')->nullable();
            $table->longText('conteudo')->nullable();
            $table->string('capa_url')->nullable();
            $table->string('pdf_url')->nullable();
            $table->timestamp('publicado_em')->nullable();
            $table->enum('status', ['rascunho', 'agendado', 'publicado'])->default('rascunho');
            $table->unsignedBigInteger('criado_por')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('publicado_em');
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roteiros');
    }
};
