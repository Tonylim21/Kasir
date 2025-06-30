<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SalesController extends Controller
{
    // Melakukan Transaksi
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'products' => 'required|array',
            'products.*.product_id' => 'required|integer|exists:products,product_id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $totalAmount = 0;
        $sale = null;

        // DB Transaction
        try {
            DB::transaction(function () use ($request, &$totalAmount, &$sale) {
                // 1. Record Penjualan Utama
                $sale = Sale::create([
                    'user_id' => Auth::id(),
                    'sale_date' => now(),
                    'total_amount' => 0, // Akan diupdate nanti
                ]);

                foreach ($request->products as $item) {
                    $product = Product::find($item['product_id']);

                    // Cek Letersediaan Stok
                    if ($product->stock < $item['quantity']) {
                        // Jika Stok Tidak Cukup, Batalkan Transaksi
                        throw new \Exception("Stock for product {$product->product_name} is insufficient.");
                    }

                    $subTotal = $product->product_price * $item['quantity'];
                    $totalAmount += $subTotal;

                    // 2. Buat Detail Penjualan
                    SaleDetails::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'sub_total' => $subTotal,
                    ]);

                    // 3. Kurangi stok produk
                    $product->decrement('stock', $item['quantity']);
                }

                // 4. Update Total Amount di Record Penjualan Utama
                $sale->update(['sale_total_amount' => $totalAmount]);
            });

            if (!$sale) {
                return response()->json(['message' => 'Transaction Failed: Sale Could Not Be Created!'], 500);
            }

            // Load relasi untuk respons JSON
            $sale->load('details.product');

            return response()->json([
                'message' => 'Transaction Successful',
                'sale' => $sale
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Transaction Failed: ' . $e->getMessage()], 400);
        }
    }
}
