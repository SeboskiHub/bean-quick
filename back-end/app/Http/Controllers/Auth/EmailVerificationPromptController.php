<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     * Adaptado para React (API)
     */
    public function __invoke(Request $request): JsonResponse
    {
        // Si el usuario ya verificó, avisamos a React para que lo deje entrar al Dashboard
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'verified' => true,
                'redirectTo' => '/dashboard'
            ]);
        }

        // Si NO ha verificado, mandamos un estado 403 (Prohibido) o un JSON informativo
        // para que React muestre el componente de "Verifica tu Email"
        return response()->json([
            'verified' => false,
            'message' => 'Tu dirección de correo electrónico no está verificada.'
        ], 403); 
    }
}