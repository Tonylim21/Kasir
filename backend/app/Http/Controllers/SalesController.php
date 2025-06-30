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
        $request->validate([
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|integer|exists:products,product_id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        // DB Transaction
        try {
            DB::transaction(function () use ($request, &$sale) {
                // 1. Record Penjualan Utama
                $sale = Sale::create([
                    'user_id' => Auth::id(),
                    'sale_date' => now(),
                    'sale_total_amount' => 0, // Akan diupdate nanti
                ]);

                $total = 0;

                foreach ($request->products as $item) {
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                    // 2. Cek Ketersediaan Stok
                    if ($product->product_stock < $item['quantity']) {
                        // Jika Stok Tidak Cukup, Batalkan Transaksi
                        throw new \Exception("Stock for {$product->product_name} is insufficient.");
                    }

                    $sub = $product->product_price * $item['quantity'];
                    $total += $sub;

                    // 3. Buat Detail Penjualan
                    SaleDetails::create([
                        'sale_id' => $sale->sale_id,
                        'product_id' => $product->product_id,
                        'quantity' => $item['quantity'],
                        'sub_total' => $sub,
                    ]);

                    // 4. Kurangi stok produk
                    $product->decrement('product_stock', $item['quantity']);
                }

                // 4. Update Total Amount di Record Penjualan Utama
                $sale->update(['sale_total_amount' => $total]);
            });

            $sale->load('details.product','user');

            return response()->json([
                'message' => 'Transaction Successful',
                'sale' => $sale
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Transaction Failed: ' . $e->getMessage()
            ], 400);
        }
    }
}
