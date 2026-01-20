<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     * Adaptado para responder a React (API)
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Si el usuario ya está verificado, avisamos a React
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Tu cuenta ya ha sido verificada.',
                'status' => 'already-verified',
                'redirectTo' => '/dashboard' // Para que React sepa a dónde mandarlo
            ]);
        }

        // 2. Enviamos el correo de verificación (Laravel usa el sistema de notificaciones)
        $request->user()->sendEmailVerificationNotification();

        // 3. Devolvemos respuesta de éxito a React
        return response()->json([
            'status' => 'verification-link-sent',
            'message' => 'Se ha enviado un nuevo enlace de verificación a tu correo.'
        ]);
    }
}