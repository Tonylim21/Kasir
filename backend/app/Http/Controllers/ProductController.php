<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    // Menampilakn Produk (Admin & Kasir)
    public function index() {
        $products = Product::latest()->get();
        return response()->json($products);
    }

    // Menambahkan Produk Baru (Admin)
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|string|max:255',
            'product_price' => 'required|integer|min:0',
            'product_stock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $product = Product::create($request->all());

        return response()->json([
            'message' => 'Product Created Successfully!',
            'product' => $product,
        ], 201);
    }

    // Menampilkan Satu Produk (Admin & Kasir)
    public function show(Product $product) {
        return response()->json($product);
    }

    // Update Product (Admin)
    public function update(Request $request, Product $product) {
        $validator = Validator::make($request->all(), [
            'product_name' => 'string|max:255',
            'product_price' => 'integer|min:0',
            'product_stock' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $product->update($request->all());

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    // Hapus Product (Admin)
    public function destroy(Product $product) {
        $product->delete();
        return response()->json(['message' => 'Product Deleted Successfully!']);
    }
}
