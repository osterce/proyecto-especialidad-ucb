# Guía: Gestión de Usuarios y Roles en el Frontend

Esta guía explica cómo el Frontend debe implementar la administración de usuarios (panel de administrador), incluyendo la creación de usuarios, asignación de roles y desactivación.

## Conceptos Clave sobre Roles

En este sistema, **los roles no se crean dinámicamente** en la base de datos a través de un endpoint. Los roles están **predefinidos**. El frontend debe proporcionar estas opciones estáticas al administrador cuando asigne roles a un usuario:

*   `ADMIN_ROLE`: Rol de administrador (todo el acceso).
*   `USER_ROLE`: Rol de usuario estándar.
*   `WAREHOUSE_ROLE`: Rol para gestión de inventario/almacén.

---

## 1. Crear un Nuevo Usuario

**Endpoint:** `POST /api/auth/register`
**Nota:** Aunque es un endpoint de registro público en el backend, en el panel de administrador se utiliza para crear cuentas a otros empleados.

**Campos a enviar desde el formulario Frontend:**
*   `name` (string, mín. 2 caracteres)
*   `email` (string, formato válido)
*   `password` (string, mín. 6 caracteres y al menos un número y letra)
*   `roles` (array de strings: `["ADMIN_ROLE", "USER_ROLE", "WAREHOUSE_ROLE"]`)

```javascript
// Ejemplo de llamada en el Frontend
const createUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};
```

---

## 2. Listar Usuarios (Panel de Administración)

**Endpoint:** `GET /api/auth/`
**Requiere:** Token JWT en el header de autorización.

Devuelve una lista de todos los usuarios, que el Frontend debe renderizar en una tabla (Data Grid).

**Campos devueltos por usuario:**
*   [id](file:///Users/oz/01-maestria-FSD/12-Proyecto/00-proyecto-especialidad/backend/src/presentation/middlewares/auth.middleware.ts#10-58): `18`
*   `name`: `"test"`
*   `email`: `"test@test.com"`
*   `roles`: `["ADMIN_ROLE"]`
*   `is_active`: `true`

---

## 3. Actualizar Roles de un Usuario

**Endpoint:** `PUT /api/auth/admin/users/:id/roles`
**Requiere:** Token JWT y que el usuario que ejecuta la acción tenga el **`ADMIN_ROLE`**.

Si en tu tabla de usuarios un administrador quiere cambiarle los permisos a un empleado, el frontend debe mostrar un selector múltiple (Checkboxes o Multi-select de Material UI / Tailwind) con los roles disponibles.

**Request body:**
```json
{
  "roles": ["USER_ROLE", "WAREHOUSE_ROLE"]
}
```

```javascript
// Ejemplo de actualización de roles
const updateUserRoles = async (userId, selectedRoles) => {
  const response = await api.put(`/auth/admin/users/${userId}/roles`, {
    roles: selectedRoles
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

---

## 4. Desactivar Usuarios (Soft Delete)

**Endpoint:** `DELETE /api/auth/deactivate/:id`
**Requiere:** Token JWT y rol de administrador (`ADMIN_ROLE`).

En lugar de eliminar un usuario permanentemente de la base de datos, el sistema permite desactivarlos. El frontend debe mostrar un botón de "Desactivar" o "Dar de baja" en la tabla de usuarios.

```javascript
const deactivateUser = async (userId) => {
  // Confirmar con el admin antes de ejecutar
  if(window.confirm('¿Seguro que desea desactivar este usuario?')) {
     await api.delete(`/auth/deactivate/${userId}`, {
       headers: { Authorization: `Bearer ${token}` }
     });
     // Recargar lista de usuarios...
  }
};
```

---

## Ejemplo de Interfaz / Formulario Sugerido (React / Vue)

Para la pantalla de **"Crear / Editar Usuario"**, el formulario debería tener esta estructura:

1.  **Datos Personales:** Input para Nombre, Email y Contraseña (obligatoria solo al crear).
2.  **Selección de Roles:** Grupo de Checkboxes:
    *   `[ ]` Administrador (ADMIN_ROLE)
    *   `[ ]` Usuario (USER_ROLE)
    *   `[ ]` Almacenista (WAREHOUSE_ROLE)
3.  **Botón de Guardar:** Al presionar, si es creación, llama a `/register`. Si es edición de roles, llama a `/admin/users/:id/roles`.

```tsx
// Ejemplo de componente de selección de roles en React
const ROLES_DISPONIBLES = [
  { value: 'ADMIN_ROLE', label: 'Administrador' },
  { value: 'WAREHOUSE_ROLE', label: 'Personal de Almacén' },
  { value: 'USER_ROLE', label: 'Usuario Estándar' },
];

function RoleSelector({ selectedRoles, onChange }) {
  const handleToggle = (roleValue) => {
    // Lógica para añadir o quitar del array selectedRoles
    if (selectedRoles.includes(roleValue)) {
      onChange(selectedRoles.filter(r => r !== roleValue));
    } else {
      onChange([...selectedRoles, roleValue]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold">Roles Asignados</label>
      {ROLES_DISPONIBLES.map(role => (
        <label key={role.value} className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={selectedRoles.includes(role.value)}
            onChange={() => handleToggle(role.value)}
          />
          {role.label}
        </label>
      ))}
    </div>
  );
}
```
