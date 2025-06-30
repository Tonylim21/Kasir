<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;
    protected $primaryKey = 'sale_id';
    protected $fillable   = [
        'user_id',
        'sale_date',
        'sale_total_amount',
    ];

    public function details() {
        return $this->hasMany(SaleDetails::class, 'sale_id'); 
    }

    public function user()  {
        return $this->belongsTo(User::class, 'user_id');
    }
}
