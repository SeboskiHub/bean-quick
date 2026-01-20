<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Empresa extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nombre',
        'nit',
        'direccion',
        'telefono',
        'descripcion',
        'logo',
        'foto_local',
    ];

    // Esto hace que las URLs completas se incluyan siempre en el JSON
    protected $appends = ['logo_url', 'foto_local_url'];

    // --- Relaciones ---

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function productos()
    {
        return $this->hasMany(Producto::class);
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'empresa_id');
    }

    // --- Accessors para React ---

    /**
     * Genera la URL completa para el logo
     */
    public function getLogoUrlAttribute()
    {
        return $this->logo ? asset('storage/' . $this->logo) : null;
    }

    /**
     * Genera la URL completa para la foto del local
     */
    public function getFotoLocalUrlAttribute()
    {
        return $this->foto_local ? asset('storage/' . $this->foto_local) : null;
    }
}