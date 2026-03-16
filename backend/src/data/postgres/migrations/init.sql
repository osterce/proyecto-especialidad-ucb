-- ============================================================
-- SISTEMA DE GESTIÓN DE INVENTARIOS TEXTIL
-- Schema PostgreSQL - init.sql
-- ============================================================

-- Extensión para UUID (opcional, usamos serial)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- MÓDULO: ROLES Y USUARIOS
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE -- ADMIN_ROLE, USER_ROLE, WAREHOUSE_ROLE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- ============================================================
-- MÓDULO: PROVEEDORES
-- ============================================================

CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  contact_name VARCHAR(100),
  phone VARCHAR(30),
  email VARCHAR(150),
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MÓDULO: CATEGORÍAS
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MÓDULO: ALMACENES
-- ============================================================

CREATE TABLE IF NOT EXISTS warehouses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  location VARCHAR(200),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MÓDULO: PRODUCTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  min_stock INTEGER NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MÓDULO: INVENTARIO (stock por producto + almacén)
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, warehouse_id)
);

-- ============================================================
-- MÓDULO: MOVIMIENTOS (entradas y salidas)
-- ============================================================

CREATE TABLE IF NOT EXISTS movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
  supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('ENTRADA', 'SALIDA')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC(14, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  reference VARCHAR(100),
  notes TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES para performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_movements_product ON movements(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_warehouse ON movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_movements_type ON movements(type);
CREATE INDEX IF NOT EXISTS idx_movements_created_at ON movements(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- FUNCIÓN: actualizar updated_at automáticamente en products
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DATOS INICIALES (seed)
-- ============================================================

-- Roles del sistema
INSERT INTO roles (name) VALUES
  ('ADMIN_ROLE'),
  ('USER_ROLE'),
  ('WAREHOUSE_ROLE')
ON CONFLICT (name) DO NOTHING;

-- Usuario administrador por defecto
-- password: Admin123 (hash bcrypt)
INSERT INTO users (name, email, password_hash) VALUES
  ('Administrador', 'admin@admin.com', '$2b$10$5tZQsiyiPz2yFH2eT0gc4.4uNMRDpuFCUCxoSq9DzBdKrOYejpNvi')
ON CONFLICT (email) DO NOTHING;

-- Asignar rol ADMIN al usuario admin (id=1, role_id=1)
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'admin@admin.com' AND r.name = 'ADMIN_ROLE'
ON CONFLICT DO NOTHING;

-- Categorías ejemplo
INSERT INTO categories (name, description) VALUES
  ('Telas', 'Telas y tejidos en general'),
  ('Hilos', 'Hilos y fibras para confección'),
  ('Accesorios', 'Botones, cremalleras y avíos'),
  ('Productos Terminados', 'Prendas y confecciones terminadas')
ON CONFLICT (name) DO NOTHING;

-- Almacén principal
INSERT INTO warehouses (name, location, description) VALUES
  ('Almacén Principal', 'Planta Baja - Zona A', 'Almacén central de materias primas'),
  ('Almacén Secundario', 'Planta Alta - Zona B', 'Almacén de productos terminados')
ON CONFLICT (name) DO NOTHING;
