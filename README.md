# 📦 DESARROLLO DE UNA APLICACIÓN FULL STACK ORIENTADA A LA GESTIÓN DE INVENTARIOS EN EL SECTOR TEXTIL

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

---

## 📋 Descripción

El sistema resuelve la **deficiente gestión y control de inventarios en el sector textil**, un problema provocado por el uso de procesos manuales propensos a error, herramientas aisladas y la falta de información en tiempo real.

El producto es una **aplicación web Full Stack** que automatiza de forma segura el control de existencias, gestionando el registro de productos, compras y ventas para actualizar el stock de manera automática y precisa. La seguridad es tratada como un atributo de calidad de primera clase, aplicando el enfoque de **"Seguridad desde el Diseño"** basado en el OWASP Top 10.

---

## 🎯 Objetivo General

Desarrollar una aplicación web Full Stack para la gestión de inventarios en el sector textil, implementando una arquitectura de monolito modular y estándares de seguridad OWASP para optimizar el control de existencias y proteger la información.

---

## ✅ Objetivos Específicos

- [ ] Diseñar la arquitectura de la aplicación bajo un enfoque de **monolito modular**, separando los contextos de productos, movimientos y reportes.
- [ ] Implementar una **API REST funcional** con los endpoints core priorizados (autenticación, productos, movimientos, inventario y dashboard).
- [ ] Persistir toda la información en una **base de datos relacional PostgreSQL** garantizando transacciones ACID.
- [ ] Permitir el **registro y control de productos e inventario** mediante CRUD completo con validación de datos.
- [ ] Proveer endpoints para la **consulta y actualización automática de stock** ante cada movimiento de entrada o salida.
- [ ] Aplicar el **Top 10 de OWASP** en Backend y Frontend para fortalecer la autenticación, autorización y prevención de ataques.
- [ ] Validar el sistema mediante **pruebas funcionales y de seguridad**.

---

## 📐 Alcance del Proyecto

### ✔️ Incluye

- Módulo de gestión de usuarios con **autenticación segura (JWT)** y Control de Acceso Basado en Roles (**RBAC**).
- **CRUD de productos** textiles con categorías y proveedores.
- Control de **entradas y salidas de mercancía** con cálculo y actualización automática del stock físico y lógico.
- **Dashboard en tiempo real** con KPIs, historial de movimientos y alertas de stock crítico.
- Gestión de **almacenes** y asignación de inventario por bodega.
- Gestión de **categorías** y **proveedores**.
- Generación de **reportes** históricos de movimientos.
- Conexión a **base de datos relacional** PostgreSQL.
- **API REST** documentada con endpoints core.

### ❌ No Incluye (por ahora)

- Integración directa con software heredado (Legacy) o ERPs financieros.
- Sistema de notificaciones push o por correo electrónico.
- Integraciones externas con sistemas de pago o logística.
- Roles avanzados multiempresa o multi-tenancy.
- Despliegue en infraestructura de alta disponibilidad (auto-scaling, balanceadores empresariales).
- Procesos físicos ajenos al software (logística de transporte, producción textil).
- Pruebas de rendimiento avanzadas (load testing).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19 + Vite 7 + TailwindCSS 4 + Shadcn/UI |
| **Backend** | Node.js 22 + Express 5 + TypeScript 5 |
| **Base de datos** | PostgreSQL 15 |
| **Autenticación** | JWT (jsonwebtoken) + bcryptjs |
| **Seguridad** | Helmet · CORS · express-rate-limit · OWASP Top 10 |
| **Validación** | Zod (frontend) + DTOs tipados (backend) |
| **Formularios** | React Hook Form |
| **Tablas** | TanStack React Table v8 |
| **Gráficos** | Recharts |
| **Testing** | Pruebas funcionales manuales + Postman |
| **Contenedorización** | Docker + Docker Compose |
| **Control de versiones** | Git + GitHub |

---

## 🏗️ Arquitectura

El sistema sigue una arquitectura de **monolito modular** con separación estricta de responsabilidades, inspirada en los principios de la **Arquitectura Limpia (Clean Architecture)**:

```
Cliente (React Frontend)
        │
        │  HTTP/REST (JWT Bearer)
        ▼
API RESTful (Express 5 Backend - Monolito Modular)
   ├── Módulo: Auth
   ├── Módulo: Productos
   ├── Módulo: Categorías
   ├── Módulo: Proveedores
   ├── Módulo: Almacenes
   ├── Módulo: Inventario
   ├── Módulo: Movimientos
   └── Módulo: Dashboard
        │
        │  Pool de conexiones (pg)
        ▼
Base de datos (PostgreSQL 15)
```

El backend organiza cada módulo en capas independientes:

```
src/
├── domain/          # Entidades, DTOs, Repositorios (interfaces), Casos de Uso
├── infrastructure/  # Implementaciones concretas: DataSources y Repositories (PostgreSQL)
└── presentation/    # Rutas, Controladores, Middlewares
```

---

## 🔗 Endpoints Core (Priorizados)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Autenticación de usuario, retorna JWT | ❌ |
| `POST` | `/api/auth/register` | Registro de nuevo usuario | ❌ |
| `GET` | `/api/auth/` | Listado de usuarios | ✅ JWT |
| `GET` | `/api/productos` | Listado del catálogo de productos | ✅ JWT |
| `POST` | `/api/productos` | Crear nuevo producto | ✅ JWT |
| `PUT` | `/api/productos/:id` | Actualizar producto | ✅ JWT |
| `DELETE` | `/api/productos/:id` | Eliminar producto | ✅ JWT |
| `GET` | `/api/inventario` | Consultar stock por almacén | ✅ JWT |
| `POST` | `/api/movimientos/entradas` | Registrar ingreso por compra | ✅ JWT |
| `POST` | `/api/movimientos/salidas` | Registrar egreso por venta (valida stock) | ✅ JWT |
| `GET` | `/api/movimientos` | Historial de movimientos | ✅ JWT |
| `GET` | `/api/dashboard` | KPIs, alertas de stock, rotación | ✅ JWT |
| `GET` | `/api/categorias` | Listado de categorías | ✅ JWT |
| `GET` | `/api/almacenes` | Listado de almacenes | ✅ JWT |
| `GET` | `/api/proveedores` | Listado de proveedores | ✅ JWT |
| `GET` | `/health` | Estado del servidor | ❌ |

---

## 🚀 Cómo Ejecutar el Proyecto (Local)

### Prerrequisitos

- [Node.js](https://nodejs.org/) v22+
- [Docker](https://www.docker.com/) y Docker Compose
- [Git](https://git-scm.com/)

### 1. Clonar el repositorio

```bash
git clone https://github.com/osterce/proyecto-especialidad-ucb
cd proyecto-especialidad-ucb
```

### 2. Levantar la base de datos con Docker

```bash
cd backend
docker compose up -d
```

> Esto inicia un contenedor PostgreSQL 15 en el puerto `5432` e inicializa automáticamente el esquema con `init.sql`.

### 3. Configurar variables de entorno del Backend

```bash
cp .env.example .env
# Editar .env con tus valores
```

### 4. Instalar dependencias e iniciar el Backend

```bash
# Desde /backend
npm install
npm run dev
```

El servidor quedará disponible en: `http://localhost:3000`  
Health check: `http://localhost:3000/health`

### 5. Configurar y ejecutar el Frontend

```bash
# Desde /frontend
cp .env.example .env
npm install
npm run dev
```

La aplicación web quedará disponible en: `http://localhost:5173`

> 🔑 **Credenciales de acceso por defecto**
>
> | Campo | Valor |
> |---|---|
> | 👤 **Usuario** | `admin@admin.com` |
> | 🔐 **Contraseña** | `Admin123` |

---

## ⚙️ Variables de Entorno

### Backend (`backend/.env`)

```env
PORT=3000
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventario_textil
DB_USER=postgres
DB_PASSWORD=postgres123

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=7d
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📁 Estructura del Proyecto

```
00-proyecto-especialidad/
├── backend/
│   ├── src/
│   │   ├── app.ts                  # Punto de entrada
│   │   ├── config/                 # Variables de entorno, JWT adapter
│   │   ├── data/postgres/          # Conexión al pool, migraciones SQL
│   │   ├── domain/                 # Entidades, DTOs, Repositorios, Casos de Uso
│   │   ├── infrastructure/         # DataSources y Repositories (PostgreSQL)
│   │   └── presentation/           # Servidor, Rutas, Controladores, Middlewares
│   ├── docker-compose.yml
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/                    # Configuración global
    │   ├── components/             # Componentes reutilizables (DataTable, Sidebar, etc.)
    │   ├── context/                # AuthContext, PermissionsContext, MenuConfigContext
    │   ├── features/               # Módulos por dominio (auth, products, inventory, etc.)
    │   ├── hooks/                  # Custom hooks globales
    │   ├── layouts/                # AppLayout
    │   ├── lib/                    # apiFetch, utils
    │   └── router/                 # AppRouter, ProtectedRoute
    ├── vite.config.js
    └── package.json
```

---

## 🔒 Seguridad (OWASP Top 10 aplicado)

| Control | Implementación |
|---|---|
| **A01 – Broken Access Control** | RBAC en servidor (AdminMiddleware) + rutas protegidas en cliente (ProtectedRoute) |
| **A02 – Cryptographic Failures** | Contraseñas hasheadas con bcryptjs (coste 10), JWT firmado, HTTPS en producción |
| **A03 – Injection** | Consultas SQL parametrizadas (`$1, $2...`) en todos los datasources |
| **A05 – Security Misconfiguration** | Helmet (cabeceras HTTP seguras), CORS restrictivo por entorno |
| **A07 – Auth Failures** | Rate limiting global (300 req/15min) + rate limiting en login (10 req/15min) |
| **A09 – Logging & Monitoring** | ErrorMiddleware centralizado, sin filtración de stack traces en producción |

---

## 👥 Equipo y Roles

| Nombre | Rol |
|---|---|
| Oscar Terceros | Full Stack Developer (Backend + Frontend + DevOps) |

---

## 📄 Licencia

Este proyecto se desarrolla con fines académicos como parte del programa de **Maestría en Ingeniería de Software Full Stack** de la **Universidad Católica Boliviana "San Pablo"**.