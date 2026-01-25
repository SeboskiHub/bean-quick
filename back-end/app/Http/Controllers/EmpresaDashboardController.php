<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Models\Empresa;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Calificacion;
use Carbon\Carbon;

class EmpresaDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $empresa = Empresa::where('user_id', $user->id)->first();

        if (!$empresa) {
            return response()->json([
                'message' => 'No tienes una empresa asociada'
            ], 404);
        }

        // Pedidos
        $pedidos = Pedido::where('empresa_id', $empresa->id);

        $totalPedidos = $pedidos->count();
        $ventasTotales = $pedidos->sum('total');

        $pedidosPorEstado = Pedido::where('empresa_id', $empresa->id)
            ->selectRaw('estado, COUNT(*) as total')
            ->groupBy('estado')
            ->get();

        $ventasMes = Pedido::where('empresa_id', $empresa->id)
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total');

        $pedidosRecientes = Pedido::where('empresa_id', $empresa->id)
            ->with('cliente:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Productos
        $totalProductos = Producto::where('empresa_id', $empresa->id)->count();

        // Calificaciones
        $calificaciones = Calificacion::whereHas('producto', function ($q) use ($empresa) {
            $q->where('empresa_id', $empresa->id);
        });

        $totalCalificaciones = $calificaciones->count();
        $promedioCalificacion = round($calificaciones->avg('estrellas'), 2);

        return response()->json([
            'empresa' => [
                'id' => $empresa->id,
                'nombre' => $empresa->nombre,
                'logo' => $empresa->logo
            ],
            'stats' => [
                'total_pedidos' => $totalPedidos,
                'ventas_totales' => $ventasTotales,
                'ventas_mes' => $ventasMes,
                'total_productos' => $totalProductos,
                'calificaciones' => [
                    'total' => $totalCalificaciones,
                    'promedio' => $promedioCalificacion
                ]
            ],
            'pedidos_por_estado' => $pedidosPorEstado,
            'pedidos_recientes' => $pedidosRecientes
        ]);
    }
}
