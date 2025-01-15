<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InsuranceModel extends Model
{
    use HasFactory;

    protected $table = 'insurance';

    public function data()
    {
        return $this->hasOne(DataModel::class, 'VIN No.', 'vin_no');
    }

    public function data1()
    {
        return $this->hasOne(Data1Model::class, 'Vin', 'vin_no');
    }
}
