<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Data1Model extends Model
{
    use HasFactory;

    protected $table = 'data1';

    public function insurance()
    {
        return $this->belongsTo(InsuranceModel::class, 'vin_no', 'Vin');
    }
}
