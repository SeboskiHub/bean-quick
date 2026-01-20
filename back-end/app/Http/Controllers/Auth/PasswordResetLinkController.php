<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class PasswordResetLinkController extends Controller
{
    /**
     * El método create() se elimina porque React 
     * renderiza su propio formulario de "Olvidé mi contraseña".
     */

    /**
     * Handle an incoming password reset link request.
     * Adaptado para API / React
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validación de los datos que vienen de React
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // 2. Intentamos enviar el enlace de recuperación
        // Laravel usará el broker de contraseñas por defecto
        $status = Password::sendResetLink(
            $request->only('email')
        );

        // 3. Verificamos si el link se envió correctamente
        if ($status == Password::RESET_LINK_SENT) {
            return response()->json([
                'status' => 'success',
                'message' => __($status) // Devuelve "Hemos enviado por correo el enlace..."
            ], 200);
        }

        // 4. Si hubo un error (ej. el correo no existe en la BD)
        return response()->json([
            'status' => 'error',
            'message' => __($status),
            'errors' => [
                'email' => [__($status)]
            ]
        ], 422);
    }
}