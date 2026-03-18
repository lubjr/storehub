<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private readonly ProductService $productService) {}

    public function index(Request $request): JsonResponse
    {
        $filters  = $request->only(['category', 'search']);
        $products = $this->productService->listProducts($filters);

        return response()->json($products);
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->productService->getProduct($id);

        return response()->json($product);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->createProduct($request->validated());

        return response()->json($product, 201);
    }

    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        $product = $this->productService->updateProduct($id, $request->validated());

        return response()->json($product);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->productService->deleteProduct($id);

        return response()->json(null, 204);
    }
}
