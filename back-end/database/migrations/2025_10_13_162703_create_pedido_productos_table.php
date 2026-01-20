<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedido_productos', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');

            // Datos de la relación
            $table->integer('cantidad')->default(1);
            $table->decimal('precio_unitario', 10, 2)->default(0); // Precio del producto en el momento del pedido

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedido_productos');
    }
};
