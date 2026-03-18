<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categoryIds = \App\Models\Category::pluck('id')->toArray();

        Product::factory(50)->make()->each(function ($product) use ($categoryIds) {
            $product->category_id = fake()->randomElement($categoryIds);
            $product->save();
        });
    }
}
