<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    // 1. Definimos la tabla si el nombre no es el estándar (opcional si tu tabla se llama 'categorias')
    protected $table = 'categorias';

    // 2. Campos que se pueden llenar (Mass Assignment)
    protected $fillable = ['nombre'];

    /**
     * Relación: Una categoría tiene muchos productos.
     */
    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
}