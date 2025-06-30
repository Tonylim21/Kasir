<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleDetails extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'sale_detail_id';
    protected $fillable = [
        'sale_id',
        'product_id',
        'quantity',
        'sub_total',
    ];

    public function sale() {
        return $this->belongsTo(Sale::class, 'sale_id');
    }

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
