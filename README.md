# ☕ BeanQuick

**BeanQuick** es una plataforma web que permite a los clientes **reservar y pagar pedidos en cafeterías antes de llegar**, evitando filas y optimizando el tiempo de atención.

Las cafeterías pueden registrar sus productos y gestionar pedidos en tiempo real, mientras que los clientes pueden explorar cafeterías, realizar pedidos y recogerlos en el horario seleccionado.

---

# 🚀 Características

## 👤 Cliente
- Registro e inicio de sesión
- Explorar cafeterías disponibles
- Ver productos por cafetería
- Añadir productos al carrito
- Editar pedidos antes de confirmar
- Seleccionar hora de recogida
- Realizar pagos en línea
- Historial de pedidos

## 🏪 Empresa
- Registro de empresa
- Gestión de información del negocio
- CRUD de productos
- Visualización de pedidos recibidos
- Gestión del estado del pedido:
  - Pendiente
  - Preparando
  - Listo
  - Entregado
  - Cancelado

## 🛠 Administrador
- Gestión de usuarios
- Gestión de empresas registradas
- Supervisión general del sistema

---

# 🧱 Tecnologías utilizadas

## Backend
- Laravel
- PHP
- MySQL

## Frontend
- React
- JavaScript
- Bootstrap

## Otros
- Axios
- Laravel Breeze (autenticación)
- Mercado Pago (integración de pagos)

---

# 📦 Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/cardona-dev/bean-quick.git
cd bean-quick
```

---

## 2. Instalar dependencias del backend

```bash
composer install
```

---

## 3. Instalar dependencias del frontend

```bash
npm install
```

---

## 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` y configurar la base de datos:

```
DB_DATABASE=beanquick
DB_USERNAME=root
DB_PASSWORD=
```

---

## 5. Generar la clave de la aplicación

```bash
php artisan key:generate
```

---

## 6. Ejecutar migraciones

```bash
php artisan migrate
```

---

## 7. Iniciar el servidor

Backend:

```bash
php artisan serve
```

Frontend:

```bash
npm run dev
```

---

# 🗄 Estructura del proyecto

```
bean-quick
│
├── app
│   ├── Models
│   ├── Http
│   │   ├── Controllers
│   │   └── Middleware
│
├── database
│   ├── migrations
│
├── resources
│   ├── js
│   │   ├── Components
│   │   ├── Pages
│   │   └── Layouts
│
├── routes
│   ├── web.php
│   └── api.php
```

---

# 💳 Integración de pagos

BeanQuick utiliza **Mercado Pago** para procesar pagos realizados por los clientes.

Flujo del proceso de pago:

1. El cliente selecciona productos.
2. Se genera el pedido.
3. Se redirige a Mercado Pago.
4. Mercado Pago confirma el pago.
5. El estado del pedido cambia a **Pagado**.

---

# 📊 Estados de pedidos

Los pedidos dentro del sistema pasan por diferentes estados:

```
Pendiente → Pagado → Preparando → Listo → Entregado
                     ↘ Cancelado
```

---

# 🧪 Futuras mejoras

- Aplicación móvil
- Sistema de notificaciones
- Panel administrativo avanzado
- Métricas de ventas para empresas
- Sistema de valoraciones de cafeterías

---

# 🤝 Contribución

Las contribuciones son bienvenidas.

1. Haz un fork del proyecto
2. Crea una nueva rama

```bash
git checkout -b feature/nueva-funcionalidad
```

3. Haz commit de tus cambios
4. Abre un Pull Request

---

# 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.