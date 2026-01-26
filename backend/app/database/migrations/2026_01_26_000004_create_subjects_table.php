<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        DB::table('subjects')->insert([
            ['id' => 1, 'name' => 'Matemática', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Português', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Ciências', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'História', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
