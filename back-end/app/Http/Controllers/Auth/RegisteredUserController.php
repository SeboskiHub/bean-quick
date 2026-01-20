<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password; // Importación corregida para reglas avanzadas

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     * Seguridad reforzada contra XSS e inyecciones.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Sanitización manual (Evitar < > etc en nombres)
        // Esto limpia etiquetas HTML antes de que lleguen a la base de datos
        $request->merge([
            'name' => strip_tags($request->name),
        ]);

        // 2. Validación con parámetros de seguridad estrictos
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[^<>{}\/]*$/'], // Bloquea caracteres de etiquetas
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => [
                'required', 
                'confirmed', 
                Password::min(8)
                    ->mixedCase()   // Obliga Mayúsculas y Minúsculas
                    ->numbers()     // Obliga Números
                    ->uncompromised() // Verifica que no sea una contraseña filtrada en internet
            ],
            'rol' => ['required', 'in:empresa,cliente,admin'],
        ], [
            // Mensajes personalizados opcionales
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'name.regex' => 'El nombre contiene caracteres no permitidos.',
        ]);

        // 3. Creación del usuario (Laravel usa PDO, lo que evita Inyección SQL)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => $request->rol,
        ]);

        // 4. Disparar evento de registro
        event(new Registered($user));

        // 5. Login y Generación de Token
        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;

        // 6. Lógica de redirección por rol
        $redirectTo = '/'; 

        if ($user->rol === 'empresa') {
            $redirectTo = '/empresa/panel';
        } elseif ($user->rol === 'admin') {
            $redirectTo = '/admin/dashboard';
        }

        // 7. Respuesta JSON limpia para React
        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'rol' => $user->rol,
            ],
            'token' => $token,
            'redirectTo' => $redirectTo,
            'message' => 'Cuenta creada y protegida correctamente'
        ], 201);
    }
}