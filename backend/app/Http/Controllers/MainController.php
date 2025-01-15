<?php

namespace App\Http\Controllers;

use App\Models\Main;
use Illuminate\Http\Request;

class MainController extends Controller
{
    public function index()
    {
        $main = Main::all();
        if ($main->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'Data not found',
            ]);
        }
        return response()->json([
            'status' => 200,
            'message' => 'Data fetched successfully',
            'data' => $main->toArray()
        ]);
    }
    public function test(){
        return response()->json([
            'message' => 'Hello World'
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'brand' => 'required',
            'model' => 'required',
            'dealer_code' => 'required',
            'account' => 'required',
            'vin' => 'required',
            'stock' => 'required',
            'date_recieved' => 'required',
            'date_accounted_sent' => 'required',
            'date_accounted' => 'required',
            'status' => 'required',
            'document' => 'required',
            'price' => 'required',
            'billing' => 'required',
            'date_payment' => 'required',
        ]);
        try {
            $main = new Main([
                'brand' => $request->get('brand'),
                'model' => $request->get('model'),
                'dealer_code' => $request->get('dealer_code'),
                'account' => $request->get('account'),
                'vin' => $request->get('vin'),
                'stock' => $request->get('stock'),
                'date_recieved' => $request->get('date_recieved'),
                'date_accounted_sent' => $request->get('date_accounted_sent'),
                'date_accounted' => $request->get('date_accounted'),
                'status' => $request->get('status'),
                'document' => $request->get('document'),
                'price' => $request->get('price'),
                'billing' => $request->get('billing'),
                'date_payment' => $request->get('date_payment'),
            ]);
    
            $main->save();

            return response()->json([
                'status' => 200,
                'message' => 'Data submitted successfully',
                'data' => $main
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Data not submitted',
                'error' => $e->getMessage()
            ]);
        }
    }
}
