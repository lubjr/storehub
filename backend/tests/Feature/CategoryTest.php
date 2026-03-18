<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_categories(): void
    {
        Category::factory()->count(3)->create();

        $this->getJson('/api/categories')
            ->assertStatus(200)
            ->assertJsonStructure(['data' => [['id', 'name']]]);
    }

    public function test_categories_are_returned_in_alphabetical_order(): void
    {
        Category::factory()->create(['name' => 'Zebra']);
        Category::factory()->create(['name' => 'Apple']);
        Category::factory()->create(['name' => 'Mango']);

        $data = $this->getJson('/api/categories')
            ->assertStatus(200)
            ->json('data');

        $names = array_column($data, 'name');

        $this->assertEquals(['Apple', 'Mango', 'Zebra'], $names);
    }

    public function test_category_response_does_not_expose_timestamps(): void
    {
        Category::factory()->create();

        $data = $this->getJson('/api/categories')
            ->assertStatus(200)
            ->json('data.0');

        $this->assertArrayNotHasKey('created_at', $data);
        $this->assertArrayNotHasKey('updated_at', $data);
    }
}
