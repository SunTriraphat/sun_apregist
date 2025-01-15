<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataModel extends Model
{
    use HasFactory;

    protected $table = 'data';

    public function insurance()
    {
        return $this->belongsTo(InsuranceModel::class, 'vin_no', 'VIN No.');
    }
}
