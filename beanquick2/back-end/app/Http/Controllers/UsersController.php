<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth; // Necesario para la autenticación

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     * Muestra una lista de todos los usuarios.
     * (Equivale al método GET /users)
     */
    public function index()
    {
        // Esto es útil para una página de administración que lista usuarios
        $users = User::select('id', 'name', 'email', 'created_at')->paginate(10);
        
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     * **CÓDIGO DE CREACIÓN/REGISTRO**
     * (Equivale al método POST /users)
     */
    public function store(Request $request)
    {
        try {
            // 1. Validación de la Solicitud
            $validatedData = $request->validate([
                'name' => 'required|string|max:100',
                // Asegura que el email es único en la tabla 'users'
                'email' => 'required|string|email|unique:users|max:100',
                // Requerimos que la clave se envíe y se confirme
                'password' => 'required|string|min:8|confirmed', 
            ]);

            // 2. Creación del Usuario
            // El Mutator en el modelo User hashea la clave automáticamente
            $user = User::create($validatedData);

            // 3. Respuesta Exitosa
            return response()->json([
                'message' => 'Usuario creado/registrado exitosamente.',
                'user' => $user->only(['id', 'name', 'email']),
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * MÉTODOS DE AUTENTICACIÓN
     * -----------------------------
     */

    /**
     * Handle an authentication attempt.
     * Intenta autenticar a un usuario y emite un token (Login).
     * (Equivale al método POST /login o similar)
     */public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        // ESTA LÍNEA AHORA FUNCIONARÁ
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso.',
            'user' => $user->only(['id', 'name', 'email']),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }

    return response()->json(['message' => 'Credenciales inválidas.'], 401);
}

public function logout(Request $request)
{
    // ESTA LÍNEA AHORA FUNCIONARÁ
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Sesión cerrada exitosamente.'], 200);
}

    /**
     * -----------------------------
     * FIN MÉTODOS DE AUTENTICACIÓN
     */

    /**
     * Display the specified resource.
     * Muestra un usuario específico, usando Route Model Binding.
     * (Equivale al método GET /users/{user})
     */
    public function show(User $user)
    {
        // Laravel automáticamente inyecta el usuario basado en el ID de la URL
        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'created_at', 'email_verified_at'])
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Actualiza un usuario existente.
     * (Equivale al método PUT/PATCH /users/{user})
     */
    public function update(Request $request, User $user)
    {
        // Lógica de actualización (p. ej., cambiar el nombre o el correo)
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:100',
            // La validación de unicidad debe ignorar al usuario actual
            'email' => 'sometimes|string|email|max:100|unique:users,email,' . $user->id,
        ]);
        
        $user->update($validatedData);

        return response()->json(['message' => 'Usuario actualizado con éxito.'], 200);
    }

    /**
     * Remove the specified resource from storage.
     * Elimina un usuario.
     * (Equivale al método DELETE /users/{user})
     */
    public function destroy(User $user)
    {
        $user->delete();
        
        return response()->json(['message' => 'Usuario eliminado con éxito.'], 204); // Código 204: Sin Contenido
    }
    
    // Los métodos 'create' y 'edit' se suelen dejar vacíos o se eliminan en APIs,
    // ya que solo se usan para devolver vistas (formularios) en aplicaciones web tradicionales.
    public function create() { /* No usado en API */ }
    public function edit(User $user) { /* No usado en API */ }
}