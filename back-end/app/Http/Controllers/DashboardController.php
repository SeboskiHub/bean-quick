<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Empresa;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Determina la ruta de inicio según el rol del usuario.
     * GET /api/dashboard-check
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();

        // 1. Lógica para Empresa
        if ($user->rol === 'empresa') {
            $empresa = Empresa::where('user_id', $user->id)->first();

            if (!$empresa) {
                // Si la empresa no existe en la tabla, debe completarse el perfil
                return response()->json([
                    'rol' => 'empresa',
                    'redirectTo' => '/empresa/create'
                ]);
            }

            return response()->json([
                'rol' => 'empresa',
                'redirectTo' => '/empresa/dashboard'
            ]);
        }

        // 2. Lógica para Cliente
        if ($user->rol === 'cliente') {
            return response()->json([
                'rol' => 'cliente',
                'redirectTo' => '/cliente/dashboard'
            ]);
        }

        // 3. Lógica para Admin
        if ($user->rol === 'admin') {
            return response()->json([
                'rol' => 'admin',
                'redirectTo' => '/admin/dashboard'
            ]);
        }

        // 4. Caso de error: Sin rol válido
        return response()->json([
            'message' => 'No se encontró un rol válido para este usuario.'
        ], 403);
    }
}