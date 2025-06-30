<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;

class SalesDetailsController extends Controller
{
    // Ringkasan Semua Daftar Transaksi
    public function index() {
        // Eager load relasi 'user' untuk menampilkan nama kasir
        $sales = Sale::with('user:id,name,username')->latest()->paginate(15);

        return response()->json($sales);
    }

    // Lihat Detail Satu Transaksi
    public function show ($id) {
        // Eager load semua relasi yang dibutuhkan
        $sale = Sale::with(['user:id,name,username', 'details.product'])->find($id);

        if (!$sale) {
            return response()->json(['message' => 'Transaction Not Found'], 404);
        }

        return response()->json($sale);
    }
}
