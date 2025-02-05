<?php

namespace App\Http\Controllers;

use App\Models\Data1Model;
use App\Models\FourInsuredData;
use App\Models\InsuranceModel;
use App\Models\DataModel;
use App\Models\KanXDealer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class DataController extends Controller
{
    public function getdata_merge(Request $request)
    {
        $page = $request->input('page', 1); // ค่าเริ่มต้นคือ 1 ถ้าไม่มีการส่งค่า page มา
        $vin = $request->input('vin');

        if (!is_numeric($page) || $page < 1) {
            return response()->json(['error' => 'Page must be a positive number'], 400);
        }

        $limit = 10; // จำนวนข้อมูลที่ต้องการดึงในแต่ละหน้า
        $offset = ($page - 1) * $limit;

        $data = DB::connection('byd')->table('insurance')
            ->leftJoin('data', 'insurance.vin_no', '=', DB::raw('`data`.`VIN No.`'))
            ->leftJoin('data1', 'insurance.vin_no', '=', 'data1.Vin')
            ->selectRaw(
                'insurance.policy_no,
                        insurance.start_date,
                        insurance.vin_no,
                        insurance.payment_month,
                        data1.DateTimeUtc,
                        data1.Model,
                        data1.SubModel,
                        data1.InsuranceProvider,
                        data1.DealershipName'
            );

        if (!empty($vin)) {
            $data->where('insurance.vin_no', 'like', '%' . $vin . '%');
        }

        // ->orderBy('data1.DateTimeUtc', 'desc')
        $results = $data->skip($offset)
            ->take($limit)
            ->get();

        return response()->json($results);
    }

    public function getdata_search(Request $request)
    {
        $search = $request->input('vin');

        if (strlen($search) < 3) {
            return response()->json(['error' => 'Search term must be at least 3 characters long'], 400);
        }

        $data = DB::connection('byd')->table('insurance')
            ->leftJoin('data', DB::raw('`data`.`VIN No.`'), '=', 'insurance.vin_no')
            ->leftJoin('data1', 'insurance.vin_no', '=', 'data1.Vin')
            // ->select('data.*', 'data1.*', 'insurance.*')
            ->selectRaw('insurance.policy_no,
                        insurance.start_date,
                        insurance.vin_no,
                        insurance.payment_month,
                        data1.DateTimeUtc,
                        data1.Model,
                        data1.SubModel,
                        data1.InsuranceProvider,
                        data1.DealershipName')
            // ->orderBy('data1.DateTimeUtc', 'desc')
            ->where(DB::raw('insurance.vin_no'), 'like', '%' . $search . '%')
            ->take(10)
            ->get();

        return response()->json($data);
    }

    public function getdata_detail(Request $request)
    {
        $vin = $request->input('vin');

        // $data = DB::connection('byd')->table('data')
        //     ->leftJoin('insurance', DB::raw('`data`.`VIN No.`'), '=', 'insurance.vin_no')
        //     ->select('data.*', 'insurance.*')
        //     ->where('insurance.policy_no', $policy_no)
        //     ->get();

        $data = DB::connection('byd')->table('data1')
            ->leftJoin('insurance', 'data1.Vin', '=', 'insurance.vin_no')
            ->leftJoin('data', DB::raw('`data`.`VIN No.`'), '=', 'data1.Vin')
            // ->select('data.*', 'data1.*', 'insurance.*')
            ->selectRaw('data.`Insurance dealer` AS dealer_name,
                        data.`MODEL NAME` ,
                        data.`MODEL NAME`,
                        data.`VIN No.` AS vin_no,
                        data1.CustomerFirstName,
                        data1.CustomerLastName,
                        data1.InsuranceProvider,
                        data1.DealershipName,
                        data1.Model,
                        data1.DateTimeUtc,
                        data1.Vin,
                        insurance.policy_no,
                        DATE_FORMAT(insurance.start_date , "%d/%m/%Y") as start_date,
		                DATE_FORMAT(ADDDATE(insurance.start_date, INTERVAL 1 YEAR),"%d/%m/%Y") AS end_date,
                        insurance.payment_month,
                        insurance.act_no')
            ->where('data1.Vin', $vin)
            ->get();

        return response()->json($data);
    }

    public function getsum_page(Request $request)
    {
        $totalRecords = DB::connection('byd')->table('insurance')->count();
        $limit = 10;
        $totalPages = ceil($totalRecords / $limit);

        return response()->json([
            'total_pages' => $totalPages,
            'total_records' => $totalRecords
        ]);
    }
    public function getall(Request $request)
    {
        // $start_date = $request->input('start_date');
        // $end_date = $request->input('end_date');


        // if (!is_numeric($page) || $page < 1) {
        //     return response()->json(['error' => 'Page must be a positive number'], 400);
        // }

        $data = DB::select('CALL byd.GetDataMerge()');
        // print_r($data);
        // exit;
        return response()->json($data);
    }




    public function getall_insurance(Request $request)
    {
        // $page = $request->input('page', 1);
        // $vin = $request->input('vin');

        // if (!is_numeric($page) || $page < 1) {
        //     return response()->json(['error' => 'Page must be a positive number'], 400);
        // }

        $insurance = DB::connection('byd')->table('insurance')
            ->select('insurance.*')
            ->get();

        return response()->json($insurance);
    }
    public function getall_file(Request $request)
    {
        // $page = $request->input('page', 1);
        $vin = $request->input('vin');

        // if (!is_numeric($page) || $page < 1) {
        //     return response()->json(['error' => 'Page must be a positive number'], 400);
        // }
        $detail_file = DB::connection('byd')->table('detail_file')
            ->select('detail_file.*')
            ->where('detail_file.vin_no', $vin)
            ->get();

        return response()->json($detail_file);
    }

    public function getdetail_data(Request $request)
    {
        $vin = $request->input('vin');

        // $data = DB::connection('byd')->table('data')
        //     ->leftJoin('insurance', DB::raw('`data`.`VIN No.`'), '=', 'insurance.vin_no')
        //     ->select('data.*', 'insurance.*')
        //     ->where('insurance.policy_no', $policy_no)
        //     ->get();

        $data = DB::connection('byd')->table('detail')
            ->select('detail.*')
            ->where('detail.vin_no', $vin)
            ->get();

        return response()->json($data);
    }

    public function detail_edit(Request $request)
    {
        // Extract the vin_no from the request
        $vin = $request->input('vin_no');
        $idList = explode(",", $request->input('delete_id'));

        $fileNames = [];
        $filePaths = [];
        $fileData = [];


        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {

                // Get the original file name
                $fileName = $file->getClientOriginalName();

                // Store the file (you can change the storage path if needed)
                if (!Storage::exists("uploads/$vin")) {
                    Storage::makeDirectory("uploads/$vin");
                }

                // Store the file in the 'uploads/vin_no' directory
                $storedPath = $file->store("uploads/$vin");
                // $storedPath = $file->storeAs("uploads/$vin", $fileName);


                // Get the file path (You can use storage_path() or URL if needed)
                $filePaths[] = $storedPath; // This is the relative path within storage
                $fileData[] = [
                    'name' => $fileName,
                    'path' => $storedPath,  // Store relative file path
                    'update_date' => now(),
                ];
            }
            // If you need the full file path, you can use the storage helper:
            // $fullPath = storage_path("app/{$storedPath}");
        }

        // Return a response with the file names and file paths


        $dataToUpdateOrInsert = $request->except(['file', 'files', 'delete_id']);

        $currentDate = now();
        $dataToUpdateOrInsert['update_date'] = $currentDate;
        // Check if the record exists
        $existingRecord = DB::connection('byd')->table('detail')->where('vin_no', $vin)->first();

        // $logData = array_merge($dataToUpdateOrInsert, ['vin_no' => $vin, 'update_date' => $currentDate,'upload_path' => $filePaths]);
        $logData = array_merge($dataToUpdateOrInsert, ['vin_no' => $vin, 'update_date' => $currentDate]);
        if ($existingRecord) {

            $result = DB::connection('byd')->table('detail')->where('vin_no', $vin)->update($logData);
            if ($idList) {
                foreach ($idList as $id) {
                    // $existingRecordFile = DB::connection('byd')->table('detail_file')->where('id', $id)->first();
                    // $path = 'app/' . $existingRecordFile->path;
                    // if (Storage::exists($path)) {
                    //     Storage::delete($path); // Deletes the file

                    // }
                    DB::connection('byd')->table('detail_file')->where('id', $id)->delete();
                }
            }
            // if ($existingRecordFile) {
            //     DB::connection('byd')->table('detail_file')->where('vin_no', $existingRecord->vin_no)->delete();
            // }

            foreach ($fileData as $file) {
                // Ensure permission data has required fields
                if (isset($file)) {
                    DB::connection('byd')->table('detail_file')->insert(array_merge(['vin_no' => $vin], $file));
                }
            }
        } else {
            // Insert a new record if it doesn't exist
            $result = DB::connection('byd')->table('detail')->insert(array_merge(['vin_no' => $vin], $logData));
            if ($result) {
                // Step 3: Insert into the 'detail_file' table using the inserted detail ID

                foreach ($fileData as $file) {
                    // Ensure permission data has required fields
                    if (isset($file)) {
                        DB::connection('byd')->table('detail_file')->insert(array_merge(['vin_no' => $vin], $file));
                    }
                }

                // Return success response

            } else {
                return response()->json([
                    'message' => 'Failed to insert detail record!',
                ], 500);
            }
        }

        $logData = array_merge($dataToUpdateOrInsert, ['vin_no' => $vin, 'update_date' => $currentDate]);
        $result_log = DB::connection('byd')->table('detail_log')->insert($logData);

        // Return the result
        return response()->json([
            'success' => $result ? true : false,
            'message' => $result ? 'Record inserted or updated successfully.' : 'Failed to insert or update record.'
        ]);
    }

    public function getall_user(Request $request)
    {


        $data = DB::connection('byd')->table('users')
            ->select('users.*')
            ->get();

        return response()->json($data);
    }
    public function getall_dealer_code(Request $request)
    {


        $data = DB::connection('byd')->table('tb_dealer')
            ->select('tb_dealer.*')
            ->get();

        return response()->json($data);
    }
    public function getall_menu(Request $request)
    {

        // $data = DB::connection('byd')->table('data')
        //     ->leftJoin('insurance', DB::raw('`data`.`VIN No.`'), '=', 'insurance.vin_no')
        //     ->select('data.*', 'insurance.*')
        //     ->where('insurance.policy_no', $policy_no)
        //     ->get();

        $data = DB::connection('byd')->table('menu')
            ->select('menu.*')
            ->get();

        return response()->json($data);
    }
    public function detail_user(Request $request)
    {


        $id = $request->input('id');

        $data = DB::connection('byd')->table('users')
            ->select('users.*')
            ->where('users.id', $id)
            ->get();

        return response()->json($data);
    }
    public function add_user(Request $request)
    {

        $data = DB::connection('byd')
            ->table('users')
            ->insert([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => bcrypt($request->salt),
                'salt' => $request->salt
            ]);
        // $data = DB::connection('byd')->table('users')
        //     ->select('users.*')
        //     ->where('users.id', $id)
        //     ->get();

        return response()->json($data);
    }
    public function edit_user(Request $request)
    {
        $id = $request->input('id');
        $data = DB::connection('byd')
            ->table('users')
            ->where('id', $id)
            ->update([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => bcrypt($request->salt),
                'salt' => $request->salt
            ]);
        // $data = DB::connection('byd')->table('users')
        //     ->select('users.*')
        //     ->where('users.id', $id)
        //     ->get();

        return response()->json($data);
    }
    public function import_info_form(Request $request)
    {
        // Get the list of valid columns from the database table
        $tableColumns = DB::connection('byd')
            ->getSchemaBuilder()
            ->getColumnListing('data1');

        $dealerData = DB::connection('byd')->table('tb_dealer')
            ->select('tb_dealer.dealerName','tb_dealer.dealerCode')
            ->get();

        // Filter input data to include only valid columns
        // $processedData = collect($request->all())->map(function ($item) use ($tableColumns) {
        //     // Filter keys to include only those in the table schema
        //     $filteredItem = collect($item)->only($tableColumns);

        //     // Add missing columns with default values (e.g., null)
        //     foreach ($tableColumns as $column) {
        //         if (!isset($filteredItem[$column])) {
        //             $filteredItem[$column] = null; // Use a default value as needed
        //         }
        //     }

        //     return $filteredItem->toArray();
        // })->toArray();

        $processedData = collect($request->all())->map(function ($item) use ($tableColumns, $dealerData) {
            // Filter keys to include only those in the table schema
            $filteredItem = collect($item)->only($tableColumns);
           
            // Add missing columns with default values (e.g., null)
            foreach ($tableColumns as $column) {
                if (!isset($filteredItem[$column])) {
                    $filteredItem[$column] = null; // Use a default value as needed
                    
                }
            }
            unset($filteredItem['id']);
            // Find matching dealer data by dealerName
            $matchingDealer = $dealerData->firstWhere('dealerName', $filteredItem['DealershipName']);

            // Add dealer code if a match is found
            if ($matchingDealer) {
                
                $filteredItem['DealerCode'] = $matchingDealer->dealerCode;
            }else{
                
                $filteredItem['DealerCode'] = null;
                DB::connection('byd')
                ->table('tb_dealer')
                ->insert(['dealerName' => $filteredItem['DealershipName'], 'dealerCode' => null]);
            }
            
            return $filteredItem->toArray();
        })->toArray();

    
        // Insert the processed data into the database
        $isInserted = DB::connection('byd')
            ->table('data1')
            ->insert($processedData);

        // Return a response
        return response()->json([
            'success' => $isInserted,
            'message' => 'Data inserted successfully!',
        ]);
    }

    public function edit_permission(Request $request)
    {
        // Extract data from the request
        $userId = $request->input('user_id');
        $permissions = $request->input('permissions');

        // Basic validation logic (optional but recommended)
        if (!$userId || !is_array($permissions)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input data',
            ], 400);
        }

        // Delete existing permissions for the given user_id
        DB::connection('byd')->table('permission')
            ->where('user_id', $userId)
            ->delete();

        // Insert the new permissions into the database
        foreach ($permissions as $permission) {
            // Ensure permission data has required fields
            if (isset($permission)) {
                DB::connection('byd')->table('permission')->insert([
                    'user_id' => $userId,
                    'menu' => $permission['menu'],
                    'is_view' => $permission['is_view'],
                    'is_create' => $permission['is_create'],
                    'is_edit' => $permission['is_edit'],
                    'is_delete' => $permission['is_delete'],
                ]);
            }
        }

        // Return a success response
        return response()->json([
            'success' => true,
            'message' => 'Permissions added successfully',
        ]);
    }

    public function detail_permission(Request $request)
    {
        $user_id = $request->input('user_id');

        $data = DB::connection('byd')->table('permission')
            ->select('permission.*')
            ->where('permission.user_id', $user_id)
            ->get();

        return response()->json($data);
    }

    public function download_file(Request $request)
    {

        // $filePath = storage_path('app/' . $request->input('path'));

        $path = storage_path('app/'  . $request->input('path'));
        if (!file_exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        return response()->download($path);
    }


    //chart 
    public function getbyd_summary(Request $request)
    {
        $start_date = $request->input('start_date') . 'T00:00:00Z';
        $end_date = $request->input('end_date') . 'T23:59:59Z';

        $cost_url = 'https://bone-service.apregist.com/api/cost/lmg/brand/get/275';
        $cost_data = Http::get($cost_url)->json();

        $model_url = 'https://bone-service.apregist.com/api/byd/model';
        $model_data = Http::get($model_url)->json();
        $all_model_byd = collect($model_data);
        $listArr = [];
        foreach ($all_model_byd as $key => $value) {
            $listArr[] = $value['model'];
        }
        //ข้อมูลสัดส่วนประกัน--------------------------
        $data = DB::select(
            'CALL GetBydSummary(:start_date,:end_date)',
            ['start_date' => $start_date, 'end_date' => $end_date]
        );

        //ข้อมูลเบี้ยประกัน(ไม่รวม ew)---------------------------
        $data1 = DB::connection('byd')->table('data1')
            ->select('data1.*')
            ->whereBetween('data1.DateTimeUtc', [$start_date, $end_date])
            ->where('data1.Model', '<>', 'D9')
            // ->whereIn('data1.Model', $listArr)
            ->whereIn('data1.InsuranceProvider', ['LMG', 'TOKIO_MARINE', 'VIRIYAH'])
            // ->where('data1.InsuranceProvider', 'NOT LIKE', '%test%')
            ->get();

        $data1 = $data1->toArray();
        $costCollection = collect($cost_data);

        foreach ($data1 as &$item) {
            // Find a matching model in cost_data

            $costItem = $costCollection->first(function ($cost) use ($item) {

                $item->Model = str_replace('_', '', $item->Model);
                return $cost['model'] === $item->Model;
            });

            // If a match is found, add the 'prb' property
            if ($costItem) {
                $item->prb = 600;
                $item->pre = $costItem['pre'];
                if ($costItem['model'] == 'ATTO_3' || $costItem['model'] == 'DOLPHIN') {
                    $item->ew = 9494.71;
                } else if ($costItem['model'] == 'M6'  || $costItem['model'] == 'SEALION_7') {
                    $item->ew = 12000;
                } else if ($costItem['model'] == 'SEAL') {
                    $item->ew = 11635.24;
                }
            } else {
                $item->prb = 0; // Add null if no match is found
                $item->pre = 0; // Add null if no match is found
                $item->ew = 0; // Add null if no match is found
            }
        }

        $premium = collect($data1)
            ->groupBy('InsuranceProvider')
            ->map(function ($group) {
                return [
                    'total_prb' => $group->sum('prb'), // Sum of prb in each group
                    'total_pre' => $group->sum('pre'), // Sum of pre in each group
                    'total_ew' => $group->sum('ew'), // Sum of pre in each group
                    'amount' => $group->count(), // Count of records in each group
                ];
            });

        //ข้อมูล ew 
        $data_ew = DB::connection('byd')->table('data1')
            ->select('data1.*')
            ->whereBetween('data1.DateTimeUtc', [$start_date, $end_date])
            ->where('data1.Model', '<>', 'D9')
            ->whereIn('data1.Model', ['ATTO_3', 'DOLPHIN', 'M6', 'SEALION_7', 'SEAL'])
            // ->where('data1.InsuranceProvider', 'NOT LIKE', '%test%')
            ->get();
        $data_ew = $data_ew->toArray();
        foreach ($data_ew as $key => &$item) {
            // Find a matching model in cost_data
            $costItem = $costCollection->first(function ($cost) use ($item) {
                $item->Model = str_replace('_', '', $item->Model);
                return $cost['model'] === $item->Model;
            });

            // If a match is found, add the 'ew' property
            if ($costItem) {
                if ($costItem['model'] == 'ATTO3' || $costItem['model'] == 'DOLPHIN') {
                    $item->ew = 9494.71;
                } elseif ($costItem['model'] == 'M6' || $costItem['model'] == 'SEALION7') {
                    $item->ew = 12000;
                } elseif ($costItem['model'] == 'SEAL') {
                    $item->ew = 11635.24;
                }
            } else {
                $item->ew = 0; // Add null if no match is found
                // Remove the item if no match is found
                // unset($data_ew[$key]);
            }
        }

        // Reset array keys after removing items
        $data_ew = array_values($data_ew);

        $premium_ew = collect($data_ew)
            ->groupBy('InsuranceProvider')
            ->map(function ($group) {
                return [
                    'total_ew' => $group->sum('ew'), // Sum of pre in each group
                    'amount' => $group->count(), // Count of records in each group
                ];
            });
        // print_r($premium_ew);
        // exit;
        return response()->json([
            'data' => $data,
            'premium' => $premium,
            'premium_ew' => $premium_ew
        ]);
    }
    public function getdenza_summary(Request $request)
    {
        $start_date = $request->input('start_date') . 'T00:00:00Z';
        $end_date = $request->input('end_date') . 'T23:59:59Z';

        $cost_url = 'https://bone-service.apregist.com/api/cost/lmg/brand/get/299';
        $cost_data = Http::get($cost_url)->json();

        $model_url = 'https://bone-service.apregist.com/api/denza/model';
        $model_data = Http::get($model_url)->json();
        $all_model_byd = collect($model_data);
        $listArr = [];
        foreach ($all_model_byd as $key => $value) {
            $listArr[] = $value['model'];
        }
        $data = DB::select(
            'CALL GetDenzaSummary(:start_date,:end_date)',
            ['start_date' => $start_date, 'end_date' => $end_date]
        );
        $data1 = DB::connection('byd')->table('data1')
            ->select('data1.*')
            ->whereBetween('data1.DateTimeUtc', [$start_date, $end_date])
            ->where('data1.Model', 'D9')
            // ->whereIn('data1.Model', $listArr)
            ->whereIn('data1.InsuranceProvider', ['LMG', 'TOKIO_MARINE'])
            // ->where('data1.InsuranceProvider', 'NOT LIKE', '%test%')
            ->get();


        // dd($data1);
        $data1 = $data1->toArray();
        $costCollection = collect($cost_data);

        foreach ($data1 as &$item) {
            // Find a matching model in cost_data

            $costItem = $costCollection->first(function ($cost) use ($item) {
                return $cost['model'] === $item->Model;
            });

            // If a match is found, add the 'prb' property
            if ($costItem) {
                $item->prb = 600;
                $item->pre = $costItem['pre'];
                if ($costItem['model'] == 'ATTO_3' || $costItem['model'] == 'DOLPHIN') {
                    $item->ew = 9494.71;
                } else if ($costItem['model'] == 'M6'  || $costItem['model'] == 'SEALION_7') {
                    $item->ew = 12000;
                } else if ($costItem['model'] == 'SEAL') {
                    $item->ew = 11635.24;
                }
            } else {
                $item->prb = 0; // Add null if no match is found
                $item->pre = 0; // Add null if no match is found
                $item->ew = 0; // Add null if no match is found
            }
        }

        // Group by 'InsuranceProvider' and calculate sums for 'prb' and 'pre'
        $groupedData = collect($data1)
            ->groupBy('InsuranceProvider')
            ->map(function ($group) {
                return [
                    'total_prb' => $group->sum('prb'), // Sum of prb in each group
                    'total_pre' => $group->sum('pre'), // Sum of pre in each group
                    // 'total_ew' => $group->sum('ew'), // Sum of pre in each group
                    'amount' => $group->count(), // Count of records in each group
                ];
            });
        // Dump and die to check the grouped data with total prb, pre, and amount

        return response()->json([
            'data' => $data,
            'premium' => $groupedData
        ]);

        return response()->json($data);
    }

    public function getbyd_model(Request $request)
    {

        $start_date = $request->input('start_date') . 'T00:00:00Z';
        $end_date = $request->input('end_date') . 'T23:59:59Z';

        $data = DB::select(
            'CALL GetBydModel(:start_date,:end_date)',
            ['start_date' => $start_date, 'end_date' => $end_date]
        );


        return response()->json($data);
    }

    public function getbyd_model_line(Request $request)
    {

        $date_select = $request->input('date_select');

        $data = DB::select(
            'CALL GetBydModelLine(:date_select)',
            ['date_select' => $date_select]
        );


        return response()->json($data);
    }

    public function getcost(Request $request)
    {
        $data = DB::connection('cost')->table('tb_cost')
            ->select('tb_cost.*')
            ->get();

        return response()->json($data);
    }
}
