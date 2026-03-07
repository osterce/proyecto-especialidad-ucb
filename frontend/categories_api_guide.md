# Guía de Integración: API de Categorías

## Base URL

```
http://localhost:3000/api/categorias
```

> En producción, esta URL debe ser reemplazada por el dominio base desplegado, por ejemplo: `https://api.tu-dominio.com/api/categorias`

---

## Resumen de Endpoints

Todos los endpoints requieren estar autenticado (enviar token JWT en los headers). Las acciones de crear, editar, eliminar o activar requieren que el usuario logueado en el frontend tenga el rol de **Administrador (`ADMIN_ROLE`)**.

| Método | Ruta | Auth Requerida | Rol Mínimo | Descripción |
|--------|------|----------------|------------|-------------|
| `GET` | `/categorias` | ✅ JWT | USER | Listar todas las categorías activas |
| `POST` | `/categorias` | ✅ JWT | **ADMIN** | Crear una nueva categoría |
| `PUT` | `/categorias/:id` | ✅ JWT | **ADMIN** | Actualizar una categoría existente |
| `DELETE` | `/categorias/:id` | ✅ JWT | **ADMIN** | Desactivar (soft-delete) una categoría |
| `PUT` | `/categorias/:id/activate` | ✅ JWT | **ADMIN** | Reactivar una categoría |

---

## Headers Requeridos

Para todas las peticiones a esta API, el frontend debe enviar los siguientes Headers:
```http
Content-Type: application/json
Authorization: Bearer <tu_token_jwt_aqui>
```

---

## 1. Listar Categorías — `GET /categorias`

**Acceso:** Cualquiera con sesión iniciada (JWT válido).

**Respuesta exitosa — `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "Telas",
    "description": "Telas de diferentes materiales para confección",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Hilos",
    "description": "Hilos industriales y domésticos",
    "isActive": true
  }
]
```

---

## 2. Crear Categoría — `POST /categorias`

**Acceso:** JWT + rol **ADMIN_ROLE**

**Request body:**
```json
{
  "name": "Botones",
  "description": "Accesorios y botones" 
}
```

**Reglas de validación en el formulario frontend:**
*   `name` (**Requerido**): Debe ser un texto con al menos 2 caracteres de longitud.
*   `description` (*Opcional*): Texto descriptivo.

**Respuesta exitosa — `201 Created`:**
Devuelve el objeto de la categoría creada.

```json
{
  "id": 3,
  "name": "Botones",
  "description": "Accesorios y botones",
  "isActive": true
}
```

---

## 3. Actualizar Categoría — `PUT /categorias/:id`

**Acceso:** JWT + rol **ADMIN_ROLE**

**Request body:** 
Se debe enviar al menos uno de los dos campos.
```json
{
  "name": "Telas y Textiles",
  "description": "Telas de varios tipos"
}
```

**Respuesta exitosa — `200 OK`:**
Devuelve la categoría con sus datos actualizados.

---

## 4. Desactivar Categoría — `DELETE /categorias/:id`

**Acceso:** JWT + rol **ADMIN_ROLE**

> *Nota: Este método realiza un Soft-Delete. Es decir, no borra el dato de forma permanente, solo cambia su estado a inactivo (`isActive: false`).*

**Respuesta exitosa — `200 OK`:**
```json
{
  "id": 1,
  "name": "Telas y Textiles",
  "isActive": false 
}
```

---

## 5. Reactivar Categoría — `PUT /categorias/:id/activate`

**Acceso:** JWT + rol **ADMIN_ROLE**

**Parámetro de ruta:** `:id` — ID numérico de la categoría a reactivar.

**Respuesta exitosa — `200 OK`:**
Devuelve la categoría con el estado modificado (`isActive: true`).

```json
{
  "id": 1,
  "name": "Telas y Textiles",
  "isActive": true 
}
```

---

## Ejemplo: Servicio en TypeScript (Frontend API Client)

Puedes usar este molde en tu proyecto frontend (usando `fetch`) para interactuar con la API:

```typescript
const BASE_URL = 'http://localhost:3000/api/categorias';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface CategoriaData {
  name: string;
  description?: string;
}

export const categoriasService = {
  // Listar todas las categorías
  async getCategorias() {
    const res = await fetch(BASE_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Crear una nueva categoría
  async createCategoria(data: CategoriaData) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Actualizar una categoría existente
  async updateCategoria(id: number, data: Partial<CategoriaData>) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Desactivar categoría
  async deactivateCategoria(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Reactivar categoría
  async activateCategoria(id: number) {
    const res = await fetch(`${BASE_URL}/${id}/activate`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};
```
