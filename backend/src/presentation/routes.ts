import { Router } from 'express';
import { PostgresDatabase } from '../data/postgres/postgres.database';
import { AuthPostgresDataSourceImpl } from '../infrastructure/datasources/auth-postgres.datasource.impl';
import { SupplierPostgresDataSourceImpl } from '../infrastructure/datasources/supplier-postgres.datasource.impl';
import { CategoryPostgresDataSourceImpl } from '../infrastructure/datasources/category-postgres.datasource.impl';
import { WarehousePostgresDataSourceImpl } from '../infrastructure/datasources/warehouse-postgres.datasource.impl';
import { ProductPostgresDataSourceImpl } from '../infrastructure/datasources/product-postgres.datasource.impl';
import { InventoryPostgresDataSourceImpl } from '../infrastructure/datasources/inventory-postgres.datasource.impl';
import { MovementPostgresDataSourceImpl } from '../infrastructure/datasources/movement-postgres.datasource.impl';
import { AuthRepositoryImpl } from '../infrastructure/repositories/auth.repository.impl';
import {
  SupplierRepositoryImpl, CategoryRepositoryImpl, WarehouseRepositoryImpl,
  ProductRepositoryImpl, InventoryRepositoryImpl, MovementRepositoryImpl,
} from '../infrastructure/repositories/repositories.impl';
import { AuthRoutes } from './auth/auth.routes';
import { SupplierRoutes } from './suppliers/supplier.routes';
import { CategoryRoutes } from './categories/category.routes';
import { WarehouseRoutes } from './warehouses/warehouse.routes';
import { ProductRoutes } from './products/product.routes';
import { InventoryRoutes } from './inventory/inventory.routes';
import { MovementRoutes } from './movements/movement.routes';
import { DashboardRoutes } from './dashboard/dashboard.routes';

export class AppRoutes {
  static getRouter(): Router {
    const router = Router();
    const db = PostgresDatabase.getInstance();
    const pool = db.pool;

    // Datasources
    const authDS = new AuthPostgresDataSourceImpl(pool);
    const supplierDS = new SupplierPostgresDataSourceImpl(pool);
    const categoryDS = new CategoryPostgresDataSourceImpl(pool);
    const warehouseDS = new WarehousePostgresDataSourceImpl(pool);
    const productDS = new ProductPostgresDataSourceImpl(pool);
    const inventoryDS = new InventoryPostgresDataSourceImpl(pool);
    const movementDS = new MovementPostgresDataSourceImpl(pool);

    // Repositories
    const authRepo = new AuthRepositoryImpl(authDS);
    const supplierRepo = new SupplierRepositoryImpl(supplierDS);
    const categoryRepo = new CategoryRepositoryImpl(categoryDS);
    const warehouseRepo = new WarehouseRepositoryImpl(warehouseDS);
    const productRepo = new ProductRepositoryImpl(productDS);
    const inventoryRepo = new InventoryRepositoryImpl(inventoryDS);
    const movementRepo = new MovementRepositoryImpl(movementDS);

    // Routes
    router.use('/auth', AuthRoutes.getRouter(authRepo));
    router.use('/proveedores', SupplierRoutes.getRouter(supplierRepo));
    router.use('/categorias', CategoryRoutes.getRouter(categoryRepo));
    router.use('/almacenes', WarehouseRoutes.getRouter(warehouseRepo));
    router.use('/productos', ProductRoutes.getRouter(productRepo));
    router.use('/inventario', InventoryRoutes.getRouter(inventoryRepo));
    router.use('/movimientos', MovementRoutes.getRouter(movementRepo));
    router.use('/dashboard', DashboardRoutes.getRouter());

    return router;
  }
}
