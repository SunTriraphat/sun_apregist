<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (User::where('email', $credentials['email'])->exists() && Auth::attempt($credentials)) {

            return response()->json([
                'status' => 200,
                'message' => 'Login successful',
                'data' => Auth::user()
            ]);
        }

        return response()->json([
            'status' => 401,
            'message' => 'Unauthorized'
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'User created successfully',
            'data' => $user
        ]);
    }

    public function get_user_permission(Request $request)
    {

        $id = $request->input('id');

        $data = DB::connection('byd')->table('permission')
            ->select('permission.*')
            ->where('permission.user_id', $id)
            ->get();

        return response()->json($data);
    }
}
