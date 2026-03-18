<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categoryIds = \App\Models\Category::pluck('id')->toArray();

        Product::factory(50)->create([
            'category_id' => fake()->randomElement($categoryIds),
        ]);
    }
}
