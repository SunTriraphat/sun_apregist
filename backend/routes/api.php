<?php

use App\Http\Controllers\DataController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DealerController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/submitData', [MainController::class, 'store']);

Route::get('/showData', [MainController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/get_user_permission',function(Request $request){
    return app(AuthController::class)->get_user_permission($request);
});

Route::post('/register', [AuthController::class, 'register']);

// Route::get('/getdata_merge', [DataController::class, 'getdata_merge']);

Route::post('/getdata_main',function (Request $request){
    return app(DataController::class)->getdata_merge($request);
});

Route::post('/getdata_search',function(Request $request){
    return app(DataController::class)->getdata_search($request);
});

Route::post('/getdata_detail',function(Request $request){
    return app(DataController::class)->getdata_detail($request);
});

Route::post('/getsum_page',function(Request $request){
    return app(DataController::class)->getsum_page($request);
});

Route::post('/getall_data', [DataController::class, 'getall']);

//chart
Route::get('/getbyd_summary', [DataController::class, 'getbyd_summary']);
Route::get('/getdenza_summary', [DataController::class, 'getdenza_summary']);
Route::get('/getbyd_model', [DataController::class, 'getbyd_model']);
Route::get('/getbyd_model_line', [DataController::class, 'getbyd_model_line']);
Route::get('/getcost', [DataController::class, 'getcost']);
Route::post('/get_market_share', [DashboardController::class, 'get_market_share']);

Route::prefix('script')->group(function (){
    Route::post('/map_dealer_code', [DashboardController::class, 'mapDealerCode']);
});


Route::get('/getall_insurance', [DataController::class, 'getall_insurance']);

//fill in data
Route::post('/getdetail_data',function(Request $request){
    return app(DataController::class)->getdetail_data($request);
});
Route::post('/getall_file',function(Request $request){
    return app(DataController::class)->getall_file($request);
});
Route::post('/detail_edit',function(Request $request){
    return app(DataController::class)->detail_edit($request);
});
Route::get('/getall_user',function(Request $request){
    return app(DataController::class)->getall_user($request);
});
Route::get('/getall_dealer_code',function(Request $request){
    return app(DataController::class)->getall_dealer_code($request);
});
Route::get('/getall_menu',function(Request $request){
    return app(DataController::class)->getall_menu($request);
});
Route::post('/detail_user',function(Request $request){
    return app(DataController::class)->detail_user($request);
});
Route::post('/add_user',function(Request $request){
    return app(DataController::class)->add_user($request);
});
Route::post('/edit_user',function(Request $request){
    return app(DataController::class)->edit_user($request);
});
Route::post('/import_info_form',function(Request $request){
    return app(DataController::class)->import_info_form($request);
});

//dealer 
Route::post('/detail_dealer',function(Request $request){
    return app(DataController::class)->detail_dealer($request);
});
Route::post('/edit_dealer',function(Request $request){
    return app(DataController::class)->edit_dealer($request);
});

Route::post('/update_dealer_code_data1',function(Request $request){
    return app(DataController::class)->update_dealer_code_data1($request);
});

//permission
Route::post('/edit_permission',function(Request $request){
    return app(DataController::class)->edit_permission($request);
});
Route::post('/detail_permission',function(Request $request){
    return app(DataController::class)->detail_permission($request);
});

Route::post('/download_file',function(Request $request){
    return app(DataController::class)->download_file($request);
});

Route::prefix('report')->group(function () {
    Route::post('/query', [ReportController::class, 'query']);
});

Route::prefix('manage_dealer')->group(function () {
    Route::get('/list', [DealerController::class, 'list']);
});


