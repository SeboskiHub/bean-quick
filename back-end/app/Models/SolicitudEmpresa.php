<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudEmpresa extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_empresas';

    protected $fillable = [
        'nombre',
        'correo',
        'nit',
        'telefono',
        'direccion',
        'descripcion',
        'logo',
        'foto_local',
        'estado', // 'pendiente', 'aprobado', 'rechazado'
        'token',  // Token de seguridad para la activación por correo
    ];

    // Incluimos las URLs de las imágenes en el JSON para el Admin
    protected $appends = ['logo_url', 'foto_local_url'];

    // --- Accessors para la API de Administración ---

    /**
     * URL completa del logo de la empresa solicitante
     */
    public function getLogoUrlAttribute()
    {
        return $this->logo ? asset('storage/' . $this->logo) : null;
    }

    /**
     * URL completa de la foto del local de la empresa solicitante
     */
    public function getFotoLocalUrlAttribute()
    {
        return $this->foto_local ? asset('storage/' . $this->foto_local) : null;
    }
}