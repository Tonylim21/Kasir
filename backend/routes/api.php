<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SalesDetailsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Endpoint Autentikasi
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Endpoint Yang Harus Login
Route::middleware('auth_sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Produk
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    // CRUD Admin Only
    Route::middleware('role:admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destory']);
    });

    // Transaksi Both
    Route::middleware('role:admi,kasir')->group(function () {
        Route::post('/sales', [SalesController::class, 'store']);
    });

    // Details Transaction Admin Only
    Route::middleware('role:admin')->group(function () {
        Route::get('/transactions', [SalesDetailsController::class, 'index']);
        Route::get('/transactions/{id}', [SalesDetailsController::class, 'show']);
    });
});