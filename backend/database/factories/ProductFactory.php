<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'        => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'price'       => fake()->randomFloat(2, 10, 999),
            'category_id' => Category::inRandomOrder()->first()->id,
            'image_url'   => fake()->imageUrl(640, 480, 'products'),
        ];
    }
}
