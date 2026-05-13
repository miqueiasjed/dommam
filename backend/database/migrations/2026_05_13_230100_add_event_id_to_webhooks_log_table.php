<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adiciona coluna event_id para garantir idempotência no processamento de webhooks.
     */
    public function up(): void
    {
        Schema::table('webhooks_log', function (Blueprint $table) {
            $table->string('event_id')->nullable()->unique()->after('id');
        });
    }

    /**
     * Remove a coluna event_id.
     */
    public function down(): void
    {
        Schema::table('webhooks_log', function (Blueprint $table) {
            $table->dropUnique(['event_id']);
            $table->dropColumn('event_id');
        });
    }
};
