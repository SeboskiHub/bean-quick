<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidoProducto extends Model
{
    use HasFactory;

    protected $table = 'pedido_productos';

    protected $fillable = [
        'pedido_id',
        'producto_id',
        'cantidad',
        'precio_unitario' // Guardamos el precio del momento para que no cambie el total si el producto sube de precio
    ];

    // Incluimos el subtotal calculado automáticamente en el JSON para React
    protected $appends = ['subtotal'];

    protected $casts = [
        'precio_unitario' => 'float',
        'cantidad' => 'integer',
    ];

    // --- Relaciones ---

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    // --- Accesor para React ---

    /**
     * Calcula el subtotal de esta línea de pedido (Precio x Cantidad)
     */
    public function getSubtotalAttribute()
    {
        return $this->precio_unitario * $this->cantidad;
    }
}