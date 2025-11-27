<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- ¡CLAVE DE SANCTUM!
use Illuminate\Support\Facades\Hash; // Para el Mutator si no usas casts()

class User extends Authenticatable
{
    // Asegúrate de que HasApiTokens esté AQUÍ
    use HasApiTokens, HasFactory, Notifiable; 

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // USAR EL MUTATOR O EL MÉTODO casts(), no ambos a menos que sepas por qué.
    // Usaremos el Mutator que es lo que tenías en tu Modelo 2:
    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => Hash::make($value),
        );
    }
    
    // Si quieres usar el método casts() (más moderno en Laravel 10+):
    /*
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // Esto hashea la clave automáticamente
        ];
    }
    */
}