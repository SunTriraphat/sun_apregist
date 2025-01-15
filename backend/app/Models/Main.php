<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Main extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand',
        'model',
        'dealer_code',
        'account',
        'vin',
        'stock',
        'date_recieved',
        'date_accounted_sent',
        'date_accounted',
        'status',
        'document',
        'price',
        'billing',
        'date_payment',
    ];
}
