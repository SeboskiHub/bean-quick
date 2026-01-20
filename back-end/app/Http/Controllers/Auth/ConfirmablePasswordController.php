<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;

class ConfirmablePasswordController extends Controller
{
    /**
     * En una API con React, el método "show" usualmente no se usa 
     * ya que React decide cuándo mostrar el modal de confirmación.
     */

    /**
     * Confirm the user's password.
     */
    public function store(Request $request): JsonResponse
    {
        // Validamos que el password sea correcto
        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            return response()->json([
                'message' => 'La contraseña proporcionada es incorrecta.',
                'errors' => [
                    'password' => [__('auth.password')],
                ]
            ], 422);
        }

        // En lugar de session, marcamos que se confirmó. 
        // Si usas Sanctum puro, podrías devolver un mensaje de éxito 
        // y React permitirá al usuario continuar con la acción sensible.
        $request->session()->put('auth.password_confirmed_at', time());

        return response()->json([
            'message' => 'Contraseña confirmada correctamente.',
            'confirmed' => true
        ], 200);
    }
}