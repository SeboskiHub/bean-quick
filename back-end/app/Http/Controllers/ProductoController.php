<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Empresa;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    /**
     * Obtener la empresa del usuario autenticado de forma segura.
     */
    private function getEmpresaAutenticada()
    {
        return Empresa::where('user_id', Auth::id())->first();
    }

    /**
     * Listar productos de la empresa autenticada.
     */
    public function index(): JsonResponse
    {
        $empresa = $this->getEmpresaAutenticada();

        if (!$empresa) {
            return response()->json(['message' => 'No tienes una empresa vinculada.'], 404);
        }

        $productos = Producto::where('empresa_id', $empresa->id)
            ->with('categoria')
            ->get();

        return response()->json($productos);
    }

    /**
     * MOSTRAR UN PRODUCTO (Este es el que te faltaba para que cargue el formulario)
     */
    public function show($id): JsonResponse
    {
        $empresa = $this->getEmpresaAutenticada();
        
        $producto = Producto::where('id', $id)
            ->where('empresa_id', $empresa->id)
            ->first();

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado.'], 404);
        }

        return response()->json($producto);
    }

    /**
     * Guardar un nuevo producto.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id',
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|image|max:2048',
        ]);

        $empresa = $this->getEmpresaAutenticada();

        $producto = new Producto();
        $producto->nombre = $request->nombre;
        $producto->descripcion = $request->descripcion;
        $producto->precio = $request->precio;
        $producto->empresa_id = $empresa->id;
        $producto->categoria_id = $request->categoria_id;

        if ($request->hasFile('imagen')) {
            $producto->imagen = $request->file('imagen')->store('productos', 'public');
        }

        $producto->save();

        return response()->json([
            'message' => 'Producto creado con éxito',
            'producto' => $producto
        ], 201);
    }

    /**
     * Actualizar un producto existente.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $empresa = $this->getEmpresaAutenticada();
        $producto = Producto::where('id', $id)->where('empresa_id', $empresa->id)->first();

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado.'], 404);
        }

        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'categoria_id' => 'required|exists:categorias,id',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        // He añadido 'categoria_id' al fill para que también se actualice
        $producto->fill($request->only(['nombre', 'descripcion', 'precio', 'categoria_id']));

        if ($request->hasFile('imagen')) {
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }
            $producto->imagen = $request->file('imagen')->store('productos', 'public');
        }

        $producto->save();

        return response()->json([
            'message' => 'Producto actualizado correctamente.',
            'producto' => $producto
        ]);
    }

    /**
     * Eliminar un producto.
     */
    public function destroy($id): JsonResponse
    {
        $empresa = $this->getEmpresaAutenticada();
        $producto = Producto::where('id', $id)->where('empresa_id', $empresa->id)->first();

        if (!$producto) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        if ($producto->imagen) {
            Storage::disk('public')->delete($producto->imagen);
        }

        $producto->delete();

        return response()->json(['message' => 'Producto eliminado correctamente.']);
    }
}