<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;


class AuthController extends Controller
{
    // Register
    public function register(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => ['required', Rule::in(['admin', 'kasir'])],
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    // Login
    public function login(Request $request) {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt ($request->only('username', 'password'))) {
            return response()->json(['message' => 'Invalid Login Details'], 401);
        }

        $user = User::where('username', $request['username'])->firstOrFail();
        
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login Successfull',
            'user' => $user,
            'access_token' => $token,
        ]);
    }

    // Logout
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Succesfully Logged Out!']);
    }
}
