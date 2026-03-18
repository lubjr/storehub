<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // Listing
    // -------------------------------------------------------------------------

    public function test_anyone_can_list_products(): void
    {
        Product::factory()->count(3)->create();

        $this->getJson('/api/products')
            ->assertStatus(200)
            ->assertJsonStructure([
                'data'  => [['id', 'name', 'description', 'price', 'image_url', 'category']],
                'links' => ['first', 'last', 'prev', 'next'],
                'meta'  => ['current_page', 'per_page', 'total'],
            ]);
    }

    public function test_products_list_is_paginated_with_15_per_page(): void
    {
        Product::factory()->count(3)->create();

        $this->getJson('/api/products')
            ->assertStatus(200)
            ->assertJsonPath('meta.per_page', 15);
    }

    public function test_products_can_be_filtered_by_category(): void
    {
        $target   = Category::factory()->create();
        $other    = Category::factory()->create();

        Product::factory()->count(2)->create(['category_id' => $target->id]);
        Product::factory()->count(3)->create(['category_id' => $other->id]);

        $data = $this->getJson("/api/products?category={$target->id}")
            ->assertStatus(200)
            ->json('data');

        $this->assertCount(2, $data);

        foreach ($data as $product) {
            $this->assertEquals($target->id, $product['category']['id']);
        }
    }

    public function test_products_can_be_searched_by_name(): void
    {
        $category = Category::factory()->create();

        Product::factory()->create(['name' => 'Wireless Headphones', 'category_id' => $category->id]);
        Product::factory()->create(['name' => 'Running Shoes',        'category_id' => $category->id]);

        $data = $this->getJson('/api/products?search=Wireless')
            ->assertStatus(200)
            ->json('data');

        $this->assertCount(1, $data);
        $this->assertEquals('Wireless Headphones', $data[0]['name']);
    }

    // -------------------------------------------------------------------------
    // Show
    // -------------------------------------------------------------------------

    public function test_anyone_can_view_a_product(): void
    {
        $product = Product::factory()->create();

        $this->getJson("/api/products/{$product->id}")
            ->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'name', 'description', 'price', 'category']])
            ->assertJsonPath('data.id', $product->id);
    }

    public function test_show_returns_404_for_nonexistent_product(): void
    {
        $this->getJson('/api/products/9999')
            ->assertStatus(404)
            ->assertJsonPath('message', 'Resource not found.');
    }

    // -------------------------------------------------------------------------
    // Store
    // -------------------------------------------------------------------------

    public function test_authenticated_user_can_create_product(): void
    {
        $user     = User::factory()->create();
        $category = Category::factory()->create();

        $payload = [
            'name'        => 'New Product',
            'description' => 'A great product.',
            'price'       => 49.99,
            'category_id' => $category->id,
            'image_url'   => null,
        ];

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/products', $payload)
            ->assertStatus(201)
            ->assertJsonPath('data.name', 'New Product')
            ->assertJsonPath('data.category.id', $category->id);

        $this->assertDatabaseHas('products', ['name' => 'New Product']);
    }

    public function test_guest_cannot_create_product(): void
    {
        $category = Category::factory()->create();

        $this->postJson('/api/products', [
            'name'        => 'New Product',
            'description' => 'A great product.',
            'price'       => 49.99,
            'category_id' => $category->id,
        ])->assertStatus(401);
    }

    public function test_create_product_validates_required_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/products', [])
            ->assertStatus(422)
            ->assertJsonStructure(['message', 'errors' => ['name', 'description', 'price', 'category_id']]);
    }

    public function test_create_product_requires_valid_category(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/products', [
                'name'        => 'Product',
                'description' => 'Desc',
                'price'       => 10,
                'category_id' => 9999,
            ])->assertStatus(422)
            ->assertJsonPath('errors.category_id', fn ($v) => count($v) > 0);
    }

    // -------------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------------

    public function test_authenticated_user_can_update_product(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/products/{$product->id}", [
                'name'        => 'Updated Name',
                'description' => $product->description,
                'price'       => $product->price,
                'category_id' => $product->category_id,
                'image_url'   => $product->image_url,
            ])->assertStatus(200)
            ->assertJsonPath('data.name', 'Updated Name');

        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Updated Name']);
    }

    public function test_guest_cannot_update_product(): void
    {
        $product = Product::factory()->create();

        $this->putJson("/api/products/{$product->id}", [
            'name'        => 'Hacked',
            'description' => 'desc',
            'price'       => 1,
            'category_id' => $product->category_id,
        ])->assertStatus(401);
    }

    public function test_update_returns_404_for_nonexistent_product(): void
    {
        $user     = User::factory()->create();
        $category = Category::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->putJson('/api/products/9999', [
                'name'        => 'Name',
                'description' => 'Desc',
                'price'       => 10,
                'category_id' => $category->id,
            ])->assertStatus(404);
    }

    // -------------------------------------------------------------------------
    // Destroy
    // -------------------------------------------------------------------------

    public function test_authenticated_user_can_delete_product(): void
    {
        $user    = User::factory()->create();
        $product = Product::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/products/{$product->id}")
            ->assertStatus(204);

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_guest_cannot_delete_product(): void
    {
        $product = Product::factory()->create();

        $this->deleteJson("/api/products/{$product->id}")
            ->assertStatus(401);
    }

    public function test_delete_returns_404_for_nonexistent_product(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/products/9999')
            ->assertStatus(404);
    }

    // -------------------------------------------------------------------------
    // Response contract
    // -------------------------------------------------------------------------

    public function test_product_response_does_not_expose_internal_fields(): void
    {
        $product = Product::factory()->create();

        $data = $this->getJson("/api/products/{$product->id}")
            ->assertStatus(200)
            ->json('data');

        $this->assertArrayNotHasKey('category_id', $data);
    }
}
