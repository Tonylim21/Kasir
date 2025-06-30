<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $image_path = null;
        if ($request->hasFile('product_image')) {
            $image_path = $request->file('product_image')->store('products', 'public');
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
    public function update(Request $request, $id) {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product Not Found!'], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_name' => 'string|max:255',
            'product_price' => 'integer|min:0',
            'product_stock' => 'integer|min:0',
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $product->fill($request->except('product_image'));

        if ($request->hasFile('product_image')) {
            if ($product->product_image) {
                Storage::disk('public')->delete($product->product_image);
            }
            $product->product_image = $request->file('product_image')->store('products', 'public');
        }

        $product->save();

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    // Hapus Product (Admin)
    public function destroy(Product $product) {
        if ($product->product_image) {
            Storage::disk('public')->delete($product->product_image);
        }

        $product->delete();

        return response()->json(['message' => 'Product Deleted Successfully!'], 200);
    }
}
