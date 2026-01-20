<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens; // <--- 1. AGREGADO PARA REACT

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // <--- 2. AGREGADO

    protected $fillable = [
        'name',
        'email',
        'password',
        'rol', // 'admin', 'empresa', 'cliente'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Relación: Un usuario tiene un perfil de empresa (si su rol es 'empresa')
     */
    public function empresa()
    {
        return $this->hasOne(Empresa::class, 'user_id');
    }

    /**
     * Relación 1:1 → Un usuario tiene un carrito (si es 'cliente')
     */
    public function carrito()
    {
        // Esta es la relación que permite hacer $user->carrito
        return $this->belongsToMany(Producto::class, 'carrito_productos')
                ->withPivot('cantidad')
                ->withTimestamps();
    }

    /**
     * Relación con productos (si el usuario es empresa)
     */
    public function productos()
    {
        return $this->hasMany(Producto::class, 'empresa_id');
    }

    /**
     * Historial de pedidos
     */
    public function pedidos()
    {
        // Cambiamos 'cliente_id' por 'user_id' para que coincida con tu tabla Pedidos
        return $this->hasMany(Pedido::class, 'user_id');
    }
}