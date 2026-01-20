<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Empresa;
use App\Models\Pedido;
use App\Models\SolicitudEmpresa;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\ActivacionEmpresaMail;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * Devuelve todos los datos para el Dashboard de React.
     */
    public function dashboard(): JsonResponse
    {
        return response()->json([
            'usuarios'    => User::all(),
            'empresas'    => Empresa::all(),
            'pedidos'     => Pedido::with('cliente', 'empresa')->get(),
            'solicitudes' => SolicitudEmpresa::where('estado', 'pendiente')->get(),
        ]);
    }

    /**
     * Aprueba una solicitud y envía el correo.
     */
    public function aprobar($id): JsonResponse
    {
        $solicitud = SolicitudEmpresa::findOrFail($id);

        // 1. Generamos el token único
        $token = Str::random(60);

        // 2. Actualizamos la solicitud usando la columna 'token' 
        // para que coincida con tu EmpresaActivacionController
        $solicitud->update([
            'estado' => 'aprobado',
            'token'  => $token 
        ]);

        // 3. Definimos el link que va hacia REACT
        $link = "http://localhost:5173/empresa/activar/" . $token;

        try {
            // 4. Enviamos el correo
            Mail::to($solicitud->correo)->send(new ActivacionEmpresaMail($solicitud, $link));

            return response()->json([
                'message'   => 'Solicitud aprobada y correo de activación enviado.',
                'solicitud' => $solicitud
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Solicitud aprobada pero hubo un error al enviar el correo.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rechaza la solicitud profesionalmente.
     */
    public function rechazar($id): JsonResponse
    {
        $solicitud = SolicitudEmpresa::findOrFail($id);
        $solicitud->estado = 'rechazado';
        $solicitud->save();

        return response()->json([
            'message'   => 'Solicitud rechazada.',
            'solicitud' => $solicitud
        ]);
    }
}