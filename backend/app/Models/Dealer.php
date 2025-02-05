<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dealer extends Model
{
    protected $table = 'tb_dealer';
    protected $fillable = ['dealerCode', 'dealerName'];
    public $timestamps = false;
}
