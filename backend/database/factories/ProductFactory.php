<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    private static array $products = [
        ['name' => 'Wireless Headphones',       'keyword' => 'headphones'],
        ['name' => 'Running Shoes',              'keyword' => 'sneakers'],
        ['name' => 'Yoga Mat',                   'keyword' => 'yoga'],
        ['name' => 'Coffee Maker',               'keyword' => 'coffee'],
        ['name' => 'Mechanical Keyboard',        'keyword' => 'keyboard'],
        ['name' => 'Denim Jacket',               'keyword' => 'denim,jacket'],
        ['name' => 'Stainless Steel Water Bottle','keyword' => 'water,bottle'],
        ['name' => 'Bluetooth Speaker',          'keyword' => 'speaker'],
        ['name' => 'Resistance Bands Set',       'keyword' => 'fitness,bands'],
        ['name' => 'LED Desk Lamp',              'keyword' => 'desk,lamp'],
        ['name' => 'Gaming Mouse',               'keyword' => 'gaming,mouse'],
        ['name' => 'Cotton T-Shirt',             'keyword' => 'tshirt'],
        ['name' => 'Air Fryer',                  'keyword' => 'air,fryer'],
        ['name' => 'Foam Roller',                'keyword' => 'foam,roller'],
        ['name' => 'USB-C Hub',                  'keyword' => 'usb,hub'],
        ['name' => 'Linen Trousers',             'keyword' => 'trousers'],
        ['name' => 'French Press',               'keyword' => 'french,press'],
        ['name' => 'Smart Watch',                'keyword' => 'smartwatch'],
        ['name' => 'Hiking Backpack',            'keyword' => 'backpack'],
        ['name' => 'Cast Iron Skillet',          'keyword' => 'skillet,pan'],
        ['name' => 'Noise Cancelling Earbuds',   'keyword' => 'earbuds'],
        ['name' => 'Merino Wool Sweater',        'keyword' => 'sweater'],
        ['name' => 'Standing Desk Mat',          'keyword' => 'desk,mat'],
        ['name' => 'Pour Over Kettle',           'keyword' => 'kettle'],
        ['name' => 'Portable Charger',           'keyword' => 'charger,power,bank'],
        ['name' => 'Cycling Shorts',             'keyword' => 'cycling'],
        ['name' => 'Wooden Cutting Board',       'keyword' => 'cutting,board'],
        ['name' => 'RGB Mouse Pad',              'keyword' => 'mousepad'],
        ['name' => 'Fleece Hoodie',              'keyword' => 'hoodie'],
        ['name' => 'Espresso Tamper',            'keyword' => 'espresso'],
        ['name' => 'Webcam 1080p',               'keyword' => 'webcam'],
        ['name' => 'Compression Socks',          'keyword' => 'socks'],
        ['name' => 'Herb Garden Kit',            'keyword' => 'herbs,garden'],
        ['name' => 'Mechanical Pencil Set',      'keyword' => 'pencil'],
        ['name' => 'Windbreaker Jacket',         'keyword' => 'jacket'],
        ['name' => 'Digital Kitchen Scale',      'keyword' => 'kitchen,scale'],
        ['name' => 'Lap Desk',                   'keyword' => 'laptop,desk'],
        ['name' => 'Trail Running Shoes',        'keyword' => 'trail,running'],
        ['name' => 'Ceramic Plant Pot',          'keyword' => 'plant,pot'],
        ['name' => 'Wrist Rest',                 'keyword' => 'wrist,rest'],
        ['name' => 'Swim Goggles',               'keyword' => 'swimming,goggles'],
        ['name' => 'Knife Sharpener',            'keyword' => 'knife'],
        ['name' => 'Monitor Light Bar',          'keyword' => 'monitor,light'],
        ['name' => 'Polo Shirt',                 'keyword' => 'polo,shirt'],
        ['name' => 'Cold Brew Maker',            'keyword' => 'cold,brew'],
        ['name' => 'Cable Management Kit',       'keyword' => 'cables'],
        ['name' => 'Gym Gloves',                 'keyword' => 'gym,gloves'],
        ['name' => 'Bamboo Organizer',           'keyword' => 'bamboo,organizer'],
        ['name' => 'Ergonomic Mouse',            'keyword' => 'ergonomic,mouse'],
        ['name' => 'Lightweight Sneakers',       'keyword' => 'sneakers'],
    ];

    public function definition(): array
    {
        $product = fake()->unique()->randomElement(self::$products);
        $lock    = fake()->numberBetween(1, 50);

        return [
            'name'        => $product['name'],
            'description' => fake()->sentences(3, true),
            'price'       => fake()->randomFloat(2, 9.99, 499.99),
            'category_id' => Category::inRandomOrder()->first()->id,
            'image_url'   => "https://loremflickr.com/640/480/{$product['keyword']}?lock={$lock}",
        ];
    }
}
