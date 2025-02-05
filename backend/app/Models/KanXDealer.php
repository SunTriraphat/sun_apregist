<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KanXDealer extends Model
{
    protected $connection = 'kanx';
    protected $table = 'tb_dealer_kanx';
}
