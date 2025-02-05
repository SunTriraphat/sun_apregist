<?php

namespace App\Http\Controllers;

use App\Models\Dealer;
use Illuminate\Http\Request;

class DealerController extends Controller
{
    public function list()
    {
        $data = Dealer::all();
        return response()->json($data);
    }
}
