# DESARROLLO DE UNA APLICACIÓN FULL STACK ORIENTADA A LA GESTIÓN DE INVENTARIOS EN EL SECTOR TEXTIL
## Descripción
El sistema resuelve la deficiente gestión y control de inventarios en el sector textil, un problema provocado por el uso de procesos manuales propensos a error, herramientas aisladas y la falta de información en tiempo real. El producto es una aplicación web Full Stack que automatiza de forma segura el control de existencias, gestionando el registro de productos, compras y ventas, para actualizar el stock de manera automática y precisa, mitigando vulnerabilidades a través del enfoque de "Seguridad desde el Diseño"
## Objetivo general
- Desarrollar una aplicación web Full Stack para la gestión de inventarios en el sector textil, implementando una arquitectura de monolito modular y estándares de seguridad OWASP para optimizar el control de existencias y proteger la información
## Objetivos específicos (medibles)
- Diseñar la arquitectura de la aplicación bajo un enfoque de monolito modular, separando los contextos de productos, movimientos y reportes.
- Desarrollar el Frontend con interfaces intuitivas para la administración eficiente de productos y consultas en tiempo real.
- Aplicar el top 10 de OWASP en Backend y Frontend para fortalecer la autenticación, autorización y prevención de ataques como inyecciones SQL y XSS.
- Validar el sistema mediante pruebas unitarias y de seguridad.
## Alcance (qué incluye / qué NO incluye)
Incluye:
- Módulo de gestión de usuarios con autenticación segura (JWT) y Control de Acceso Basado en Roles (RBAC).
- CRUD de productos.
- Control de entradas y salidas de mercancía con cálculo y actualización automática del stock físico y lógico.
- Dashboard en tiempo real con KPIs, historial de movimientos y alertas de stock crítico.
- Conexión a base de datos relacional para garantizar transacciones ACID.
No incluye:
- Integración directa con software heredado (Legacy) o ERPs financieros actuales de la empresa.
- Despliegue en infraestructuras de alta disponibilidad en la nube (auto-scaling o balanceadores de carga empresariales).
- Procesos físicos ajenos al software, como la logística de transporte o la producción textil.
- Uso de herramientas de pago o realización de pruebas de rendimiento avanzadas.
## Stack tecnológico
- Frontend: React + Shadcn/UI
- Backend: Node.js + Express
- Base de datos: PostgreSQL
- Control de versiones: Git + GitHub
## Arquitectura (resumen simple)
Cliente (Frontend React) → API RESTful (Backend Monolito Modular Node/Express) → Base de datos (PostgreSQL)
## Endpoints core (priorizados)
1. POST /auth/login (Autenticación de usuarios y generación de token JWT)
2. GET /productos (Lectura del catálogo de productos textiles)
3. POST /movimientos/entradas (Registro de ingresos por compras)
4. POST /movimientos/salidas (Registro de egresos por ventas con validación de stock)
5. GET /dashboard (Consulta de reportes de rotación y alertas de stock crítico)