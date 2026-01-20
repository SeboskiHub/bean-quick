<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empresa;
use App\Models\Producto;
use App\Models\Categoria; // <--- ESTA LÍNEA FALTABA
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class ClienteController extends Controller
{
    /**
     * Dashboard del cliente con productos destacados.
     */
    public function dashboard(): JsonResponse
    {
        $user = Auth::user();

        $productosDestacados = Producto::select('productos.*', DB::raw('COALESCE(SUM(pedido_productos.cantidad), 0) as total_vendido'))
            ->leftJoin('pedido_productos', 'productos.id', '=', 'pedido_productos.producto_id')
            ->with('empresa')
            ->groupBy('productos.id') // En versiones recientes de MySQL/MariaDB esto suele bastar si la config es estándar
            ->orderBy('total_vendido', 'DESC')
            ->limit(8)
            ->get();

        return response()->json([
            'user' => $user,
            'productosDestacados' => $productosDestacados
        ]);
    }
    public function showEmpresa($id)
    {
        // Buscamos la empresa por su ID
        $empresa = \App\Models\Empresa::find($id);

        if (!$empresa) {
            return response()->json(['message' => 'Empresa no encontrada'], 404);
        }

        return response()->json($empresa);
    }
    /**
     * Mostrar todas las empresas disponibles.
     */
    public function indexEmpresas(): JsonResponse
    {
        return response()->json(Empresa::all());
    }

    /**
     * Mostrar productos de una empresa seleccionada con filtros.
     */
    public function productosPorEmpresa(Request $request, $id): JsonResponse
    {
        // 1. Iniciamos la consulta
        $query = Producto::where('empresa_id', $id);

        // 2. Filtro de búsqueda por nombre
        if ($request->filled('buscar')) {
            $query->where('nombre', 'LIKE', '%' . $request->buscar . '%');
        }

        // 3. Filtro por categoría
        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }

        // 4. Ejecutamos la consulta con la relación
        $productos = $query->with('categoria')->get();

        // 5. Obtenemos categorías existentes para los filtros en React
        $categorias = Categoria::all();

        return response()->json([
            'empresa' => Empresa::findOrFail($id),
            'productos' => $productos,
            'categorias' => $categorias
        ]);
    }
}
