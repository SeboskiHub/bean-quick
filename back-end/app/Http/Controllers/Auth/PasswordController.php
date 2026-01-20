<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Http\JsonResponse;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     * Adaptado para React (API)
     */
    public function update(Request $request): JsonResponse
    {
        // Validación estándar para API
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        // Actualizamos la contraseña del usuario autenticado
        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Respondemos con éxito a React
        return response()->json([
            'message' => 'Contraseña actualizada correctamente.',
            'status' => 'password-updated'
        ], 200);
    }
}