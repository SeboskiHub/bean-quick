<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        // 1. Definimos la URL de tu frontend (React)
        // Puedes usar env('FRONTEND_URL') para que sea dinámico
        $frontendUrl = 'http://localhost:5173/dashboard';

        // 2. Si ya estaba verificado, lo mandamos directo al dashboard de React
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->away($frontendUrl . '?verified=1');
        }

        // 3. Si no, lo marcamos como verificado ahora
        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        // 4. Redirigimos a React con un parámetro en la URL para que 
        // puedas mostrar un mensaje de "¡Cuenta verificada!"
        return redirect()->away($frontendUrl . '?verified=1');
    }
}