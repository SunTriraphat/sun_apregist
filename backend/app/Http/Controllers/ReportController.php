<?php

namespace App\Http\Controllers;

use App\Models\Data1Model;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function query(Request $request)
    {
        $start_date = $request->input('start_date');
        $end_date = $request->input('end_date');

        $start_date = date('Y-m-d', strtotime($start_date)).'T00:00:00Z';
        $end_date = date('Y-m-d', strtotime($end_date)).'T23:59:59Z';
        $query_type = $request->input('query_type');
        $queryColumn = '';
        if ($query_type == 'import_date') {
            $queryColumn = 'DateTimeUtc';
        } else if ($query_type == 'coverage_date') {
            $queryColumn = 'EffectiveDateStart';
        }
        $data = Data1Model::whereBetween($queryColumn, [$start_date, $end_date])->get();
        return response()->json($data);
    }
}
