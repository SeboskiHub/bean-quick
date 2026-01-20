<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarritoProducto extends Model
{
    use HasFactory;

    protected $table = 'carrito_productos';

    protected $fillable = [
        'carrito_id',
        'producto_id',
        'cantidad',
    ];

    // Esto hace que el "subtotal" se incluya siempre en el JSON enviado a React
    protected $appends = ['subtotal'];

    public function carrito()
    {
        return $this->belongsTo(Carrito::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    /**
     * Atributo dinámico para React: Subtotal por línea
     */
    public function getSubtotalAttribute()
    {
        // Multiplica el precio del producto por la cantidad en el carrito
        return $this->producto ? $this->producto->precio * $this->cantidad : 0;
    }
}