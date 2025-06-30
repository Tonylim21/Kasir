<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_id';
    protected $fillable = [
        'product_name',
        'product_price',
        'product_stock',
    ];

    // public function saleDetails() {
    //     return $this->hasMany(SaleDetails::class, 'product_id');
    // }
}
