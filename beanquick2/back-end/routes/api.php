<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Asegúrate de importar tu controlador
use App\Http\Controllers\UsersController; 

// ------------------------------------------------------------------
// 1. RUTAS PÚBLICAS (ACCESIBLES SIN AUTENTICACIÓN)
// Estas rutas son para crear usuarios (registro) e iniciar sesión (login)
// ------------------------------------------------------------------

// POST /api/register -> UsersController@store
// Crea un nuevo usuario. Aquí se envía 'name', 'email', 'password', 'password_confirmation'.
Route::post('/register', [UsersController::class, 'store']);

// POST /api/login -> UsersController@login
// Inicia sesión, verifica credenciales y devuelve el token de acceso.
Route::post('/login', [UsersController::class, 'login']);


// ------------------------------------------------------------------
// 2. RUTAS PROTEGIDAS (REQUIEREN UN TOKEN SANCTUM VÁLIDO)
// El middleware 'auth:sanctum' verifica que se envíe un 'Bearer Token' correcto.
// ------------------------------------------------------------------

Route::middleware('auth:sanctum')->group(function () {
    
    // GET /api/user 
    // Muestra la información del usuario actualmente autenticado (la ruta que ya tenías).
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // POST /api/logout -> UsersController@logout
    // Cierra la sesión revocando el token actual.
    Route::post('/logout', [UsersController::class, 'logout']);

    // --------------------------------------------------------------
    // Rutas de recurso para usuarios (index, show, update, destroy)
    // --------------------------------------------------------------
    
    // Si quieres usar el controlador RESTful para gestionar usuarios:
    // Excluimos 'store' porque ya lo definimos como '/register'
    Route::resource('users', UsersController::class)->except(['store', 'create', 'edit']);

    // NOTA: Para acceder a /api/users/{user} (show, update, destroy), 
    // el cliente deberá incluir el token en la cabecera 'Authorization: Bearer <token>'.
});