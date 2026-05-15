<?php

namespace Database\Seeders;

use App\Models\Roteiro;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoteiroSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        Roteiro::factory()->count(18)->create();
        Roteiro::factory()->count(3)->rascunho()->create();
        Roteiro::factory()->count(2)->agendado()->create();
    }
}
