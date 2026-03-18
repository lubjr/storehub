<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('categories')->insert([
            ['name' => 'Books',          'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Clothing',       'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Electronics',    'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Home & Garden',  'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Sports',         'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}
