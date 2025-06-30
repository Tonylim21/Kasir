<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_id';
    protected $fillable = [
        'product_name',
        'product_price',
        'product_stock',
        'product_image',
    ];

    public function getRouteKeyName() {
        return 'product_id';
    }

    protected $appends = ['product_image_url'];
    public function getProductImageUrlAttribute() {
        if ($this->product_image) {
            return asset('storage/' .$this->product_image);
        }
        return 'https://via.placeholder.com/150';
    }
}