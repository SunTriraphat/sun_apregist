<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FourInsuredData extends Model
{
    use HasFactory;
    protected $connection = 'FourInsuredPayment';
    protected $table = 'insurance';
}
