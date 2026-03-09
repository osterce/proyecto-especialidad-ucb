# Guía de Integración: API de Almacenes

## Base URL

```
http://localhost:3000/api/almacenes
```

> En producción, reemplaza `http://localhost:3000` por la URL de tu servidor backend.

---

## Resumen de Endpoints

| Método | Ruta | Auth requerida | Rol mínimo | Descripción |
|--------|------|---------------|------------|-------------|
| `GET` | `/almacenes/` | ✅ JWT | USER | Obtener la lista de todos los almacenes |
| `POST` | `/almacenes/` | ✅ JWT | **ADMIN** | Crear un nuevo almacén |
| `PUT` | `/almacenes/:id` | ✅ JWT | **ADMIN** | Modificar información de un almacén existente |
| `DELETE` | `/almacenes/:id` | ✅ JWT | **ADMIN** | Desactivar un almacén (Soft delete) |

---

## Endpoints en Detalle

### 1. Obtener todos los Almacenes — `GET /almacenes/`

Devuelve una lista con todos los almacenes registrados en el sistema.

**Acceso:** JWT requerido (Cualquier usuario autenticado, ej. `USER_ROLE`).

**Headers:**
```http
Authorization: Bearer <token>
```

**Respuesta exitosa — `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "Almacén Principal",
    "location": "Planta Baja - Zona A",
    "description": "Almacén central de materias primas",
    "is_active": true,
    "createdAt": "2026-03-09T02:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Almacén Secundario",
    "location": "Planta Alta - Zona B",
    "description": "Almacén de productos terminados",
    "is_active": false,
    "createdAt": "2026-03-09T02:10:00.000Z"
  }
]
```

---

### 2. Crear Almacén — `POST /almacenes/`

Registra un nuevo almacén en el sistema.

**Acceso:** Requiere JWT + **`ADMIN_ROLE`**

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request body:**
```json
{
  "name": "Almacén Norte",
  "location": "Calle 123",
  "description": "Almacén provisional de temporada"
}
```

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| `name` | string | ✅ Sí | Mínimo 2 caracteres. Susceptibles a trim (elimina espacios al inicio/final). Debe ser **único** en BD. |
| `location` | string | ❌ No | — |
| `description` | string | ❌ No | — |

**Respuesta exitosa — `201 Created`:**
```json
{
  "id": 3,
  "name": "Almacén Norte",
  "location": "Calle 123",
  "description": "Almacén provisional de temporada",
  "is_active": true,
  "createdAt": "2026-03-09T03:00:00.000Z"
}
```

**Respuesta de Error — `400 Bad Request`:**
```json
{
  "error": "Warehouse name is required" // O: "Name must be at least 2 characters"
}
```

---

### 3. Actualizar Almacén — `PUT /almacenes/:id`

Modifica los datos de un almacén existente. Puedes enviar un solo campo o varios.

**Acceso:** Requiere JWT + **`ADMIN_ROLE`**

**Parámetro de ruta:** `:id` — ID numérico del almacén a actualizar (ej. `/almacenes/1`)

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request body:**
```json
{
  "location": "Nueva Ubicación Editada"
}
```

> **Nota:** Al menos un campo (`name`, `location` o `description`) debe ser provisto en el cuerpo de la petición.

**Respuesta exitosa — `200 OK`:**
```json
{
  "id": 1,
  "name": "Almacén Principal",
  "location": "Nueva Ubicación Editada",
  "description": "Almacén central de materias primas",
  "is_active": true,
  "createdAt": "2026-03-09T02:00:00.000Z"
}
```

---

### 4. Desactivar Almacén — `DELETE /almacenes/:id`

Oculta o bloquea un almacén sin borrar su registro histórico de la base de datos (Soft Delete: `is_active = false`).

**Acceso:** Requiere JWT + **`ADMIN_ROLE`**

**Parámetro de ruta:** `:id` — ID numérico del almacén a desactivar.

**Headers:**
```http
Authorization: Bearer <token>
```

**Respuesta exitosa — `200 OK`:**
```json
{
  "message": "Warehouse deactivated successfully"
}
```

> ⚠️ A diferencia de otros módulos, Actualmente el backend de Almacenes expone únicamente desactivación. No hay endpoint explícito de 'Activar' (`/almacenes/:id/activate`).

---

## Integración con Frontend (TypeScript)

A continuación, un ejemplo de cómo crear o extender tu servicio HTTP (`warehouseService`) en tu proyecto React/Vue/Angular:

```typescript
// src/services/warehouse.service.ts
const BASE_URL = 'http://localhost:3000/api/almacenes';

export interface Warehouse {
  id: number;
  name: string;
  location?: string;
  description?: string;
  is_active: boolean;
  createdAt: string;
}

export interface CreateWarehousePayload {
  name: string;
  location?: string;
  description?: string;
}

// Interfaz usando campos opcionales
export type UpdateWarehousePayload = Partial<CreateWarehousePayload>;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const warehouseService = {
  // GET: Listar todos
  async getAll(): Promise<Warehouse[]> {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // POST: Crear nuevo
  async create(data: CreateWarehousePayload): Promise<Warehouse> {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // PUT: Editar
  async update(id: number, data: UpdateWarehousePayload): Promise<Warehouse> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // DELETE: Desactivar
  async deactivate(id: number): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  }
};
```
