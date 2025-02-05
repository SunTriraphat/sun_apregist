<?php

namespace App\Http\Controllers;

use App\Models\Data1Model;
use App\Models\KanXDealer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Maatwebsite\Excel\Facades\Excel;

class DashboardController extends Controller
{
    public function get_market_share(Request $request)
    {
        $date_start = $request->input('start_date');
        $date_end = $request->input('end_date');
        $brand = $request->input('brand') ?? 'byd';

        // $cost_url = 'https://bone-service.apregist.com/api/denza/model';
        // ดึงข้อมูลดีลเลอร์ทั้งหมด
        $all_dealer = KanXDealer::all()->keyBy('Dealer_Code')->toArray();

        // $cost_url = 'https://bone-service.apregist.com/api/byd/model';

        $cost_url = "https://bone-service.apregist.com/api/$brand/model";

        $cost_data = Http::get($cost_url)->json();
        $all_model_byd = collect($cost_data);
        $listArr = [];
        foreach ($all_model_byd as $key => $value) {
            if ($value['model'] == "ATTO3") {
                $value['model'] = "ATTO_3";
            } else if ($value['model'] == "SEALION6") {
                $value['model'] = "SEALION_6";
            } else if ($value['model'] == "SEALION7") {
                $value['model'] = "SEALION_7";
            }

            $listArr[] = $value['model'];
        }




        // $list = implode(", ", $listArr);
        // return response()->json($listArr);
        $unknown = [];
        // ดึงข้อมูลจาก Data1Model โดยใช้วันที่เป็นเงื่อนไข
        $data1 = Data1Model::whereBetween('DateTimeUtc', [$date_start, $date_end])
            ->whereIn('Model', $listArr)

            ->select('DealershipName', 'DealerCode', DB::raw('COUNT(*) as total_count'))
            ->groupBy('DealershipName', 'DealerCode')
            ->orderBy('total_count', 'desc')
            ->get()
            ->map(function ($item) use ($all_dealer, &$unknown) {
                // หา Dealer Info จาก $all_dealer โดยใช้ Dealer_Code
                $dealer_info = $all_dealer[$item->DealerCode] ?? null;

                // เพิ่มข้อมูล Region และ Dealer_Group
                if (!isset($dealer_info['Region']) || !isset($dealer_info['Dealer_Group'])) {
                    $unknown[] = $item;
                    $item->Region = 'Blank';
                    $item->Dealer_Group = 'Blank';
                } else {
                    $item->Region = $dealer_info['Region'];
                    $item->Dealer_Group = $dealer_info['Dealer_Group'];
                }

                return $item;
            });



        // คำนวณ market share โดย Region
        $total_count = $data1->sum('total_count');
        $market_share = $data1->groupBy('Region')->map(function ($group, $region) use ($total_count) {
            $region_count = $group->sum('total_count');
            return [
                'x' => $region,
                'y' => round(($region_count / $total_count) * 100, 2),
                'text' => "{$region}: " . round(($region_count / $total_count) * 100, 2) . "%"
            ];
        })->values();

        // ดึง top 3 ดีลเลอร์
        $top = $data1->sortByDesc('total_count')->take(3)->map(function ($dealer) {
            return [
                'dealer' => $dealer->DealershipName,
                'cont' => $dealer->total_count
            ];
        })->values();

        // Query เพื่อดึงข้อมูล InsuranceProvider
        $insurance_counts = Data1Model::whereBetween('DateTimeUtc', [$date_start, $date_end])
            ->whereIn('Model', $listArr)
            ->select(
                'DealershipName',
                'DealerCode',
                'InsuranceProvider',
                DB::raw('COUNT(*) as provider_count')
            )
            ->groupBy('DealershipName', 'DealerCode', 'InsuranceProvider')
            ->orderBy('provider_count', 'desc')
            ->get();


        // ดึง Top Dealer แยกตาม Region พร้อม InsuranceProvider
        $top_by_region = $insurance_counts->groupBy(function ($item) use ($all_dealer) {
            return $all_dealer[$item->DealerCode]['Region'] ?? 'Unknown';
        })->map(function ($group) use ($all_dealer) {
            return $group->groupBy('DealershipName')->map(function ($dealerGroup, $dealerName) {
                $insuranceBreakdown = [
                    'Dhipaya' => 0,
                    'LMG' => 0,
                    'MuangThai' => 0,
                    'Navakij' => 0,
                    'Sunday' => 0,
                    'TokioMarine' => 0,
                    'Viriyah' => 0,
                ];

                $total = $dealerGroup->sum('provider_count');
                foreach ($dealerGroup as $entry) {
                    $provider = strtoupper($entry->InsuranceProvider); // แปลงชื่อเป็น UPPER_CASE
                    switch ($provider) {
                        case 'DHIPAYA':
                            $insuranceBreakdown['Dhipaya'] += $entry->provider_count;
                            break;
                        case 'LMG':
                            $insuranceBreakdown['LMG'] += $entry->provider_count;
                            break;
                        case 'MUANG_THAI':
                            $insuranceBreakdown['MuangThai'] += $entry->provider_count;
                            break;
                        case 'NAVAKIJ':
                            $insuranceBreakdown['Navakij'] += $entry->provider_count;
                            break;
                        case 'SUNDAY':
                            $insuranceBreakdown['Sunday'] += $entry->provider_count;
                            break;
                        case 'TOKIO_MARINE':
                            $insuranceBreakdown['TokioMarine'] += $entry->provider_count;
                            break;
                        case 'VIRIYAH':
                            $insuranceBreakdown['Viriyah'] += $entry->provider_count;
                            break;
                    }
                }

                return array_merge([
                    'dealer' => $dealerName,
                    'total' => $total
                ], $insuranceBreakdown);
            })->sortByDesc('total')->take(3)->values();
        });

        // ดึง Top 10 Dealer (รวมทุกภูมิภาค) พร้อม InsuranceProvider

        // $top_10_dealers = $insurance_counts->groupBy('DealershipName')
        $top_10_dealers = $insurance_counts->groupBy(function ($item) use ($all_dealer) {
            return $all_dealer[$item->DealerCode]['Dealer_Group'] ?? 'Unknown';
        })
            ->map(function ($dealerGroup, $dealerName) {

                $insuranceBreakdown = [
                    'Dhipaya' => 0,
                    'LMG' => 0,
                    'MuangThai' => 0,
                    'Navakij' => 0,
                    'Sunday' => 0,
                    'TokioMarine' => 0,
                    'Viriyah' => 0,
                ];


                $total = $dealerGroup->sum('provider_count');
             

                foreach ($dealerGroup as $entry) {
                   
                    $provider = $entry->InsuranceProvider;


                    switch ($provider) {
                        case 'DHIPAYA':
                            $insuranceBreakdown['Dhipaya'] += $entry->provider_count;
                            break;
                        case 'LMG':
                            $insuranceBreakdown['LMG'] += $entry->provider_count;
                            break;
                        case 'MUANG_THAI':
                            $insuranceBreakdown['MuangThai'] += $entry->provider_count;
                            break;
                        case 'NAVAKIJ':
                            $insuranceBreakdown['Navakij'] += $entry->provider_count;
                            break;
                        case 'SUNDAY':
                            $insuranceBreakdown['Sunday'] += $entry->provider_count;
                            break;
                        case 'TOKIO_MARINE':
                            $insuranceBreakdown['TokioMarine'] += $entry->provider_count;
                            break;
                        case 'VIRIYAH':
                            $insuranceBreakdown['Viriyah'] += $entry->provider_count;
                            break;
                    }
                }

                return array_merge([
                    'dealer' => $dealerName,
                   
                    'total' => $total
                ], $insuranceBreakdown);
            })->sortByDesc('total')->take(10)->values();
   
        return response()->json([
            'marketShare' => $market_share,
            'top' => $top,
            'unknown' => $unknown,
            'topByRegion' => $top_by_region,
            'top10Dealers' => $top_10_dealers
        ]);
    }

    public function mapDealerCode(Request $request)
    {
        $file = $request->file('file');

        if ($file) {
            $tmp = Excel::toArray([], $file);
            $data = $tmp[0];
            $header = array_shift($data);
            $dealer_name = [];
            foreach ($data as $row) {
                $dealer_name[$row[1]] = array_combine($header, $row);
            }
            $table = Data1Model::all();
            foreach ($table as $row) {
                $row->DealerCode = $dealer_name[$row->DealershipName]['Dealer code'] ?? null;
                $row->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully!'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No file uploaded!'
        ]);
    }
}
