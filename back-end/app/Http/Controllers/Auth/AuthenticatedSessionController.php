<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class AuthenticatedSessionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            
            $user = Auth::user();

            // 1. Generamos el Token Sanctum
            $token = $user->createToken('token-auth')->plainTextToken;

            // 2. Lógica de redirección mejorada
            $urlDestino = '/';

            if ($user->rol === 'empresa') {
                $empresa = \App\Models\Empresa::where('user_id', $user->id)->first();
                // Si es empresa pero no ha llenado sus datos, va a creación
                $urlDestino = (!$empresa) ? '/empresa/create' : "/empresa/panel";
            } elseif ($user->rol === 'cliente') {
                $urlDestino = '/';
            } elseif ($user->rol === 'admin') {
                $urlDestino = '/admin/dashboard';
            }

            // 3. Devolvemos el JSON con la clave 'status' que tu React espera
            return response()->json([
                'status' => 'success', // <--- ESTO ARREGLA TU FRONT
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'rol' => $user->rol,
                    'email' => $user->email,
                ],
                'token' => $token,
                'redirectTo' => $urlDestino,
                'message' => 'Login exitoso'
            ], 200);
        }

        // Si falla, enviamos error 401 con formato de mensaje claro
        return response()->json([
            'status' => 'error',
            'message' => 'Las credenciales no coinciden con nuestros registros.'
        ], 401);
    }

    public function destroy(Request $request): JsonResponse
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}