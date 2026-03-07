import { SupplierDataSource } from '../../domain/datasources/supplier.datasource';
import { SupplierRepository } from '../../domain/repositories/supplier.repository';
import { CreateSupplierDto, UpdateSupplierDto } from '../../domain/dtos/suppliers/supplier.dto';
import { SupplierEntity } from '../../domain/entities/supplier.entity';
import { CategoryDataSource } from '../../domain/datasources/category.datasource';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../../domain/dtos/categories/category.dto';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { WarehouseDataSource } from '../../domain/datasources/warehouse.datasource';
import { WarehouseRepository } from '../../domain/repositories/warehouse.repository';
import { CreateWarehouseDto, UpdateWarehouseDto } from '../../domain/dtos/warehouses/warehouse.dto';
import { WarehouseEntity } from '../../domain/entities/warehouse.entity';
import { ProductDataSource } from '../../domain/datasources/product.datasource';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from '../../domain/dtos/products/product.dto';
import { ProductEntity } from '../../domain/entities/product.entity';
import { InventoryDataSource, InventoryFilters } from '../../domain/datasources/inventory.datasource';
import { InventoryRepository } from '../../domain/repositories/inventory.repository';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { MovementDataSource, MovementFilters } from '../../domain/datasources/movement.datasource';
import { MovementRepository } from '../../domain/repositories/movement.repository';
import { CreateMovementDto } from '../../domain/dtos/movements/movement.dto';
import { MovementEntity } from '../../domain/entities/movement.entity';

export class SupplierRepositoryImpl implements SupplierRepository {
  constructor(private readonly ds: SupplierDataSource) { }
  create(dto: CreateSupplierDto): Promise<SupplierEntity> { return this.ds.create(dto); }
  getAll(): Promise<SupplierEntity[]> { return this.ds.getAll(); }
  getById(id: number): Promise<SupplierEntity> { return this.ds.getById(id); }
  update(id: number, dto: UpdateSupplierDto): Promise<SupplierEntity> { return this.ds.update(id, dto); }
  deactivate(id: number): Promise<SupplierEntity> { return this.ds.deactivate(id); }
}

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private readonly ds: CategoryDataSource) { }
  create(dto: CreateCategoryDto): Promise<CategoryEntity> { return this.ds.create(dto); }
  getAll(): Promise<CategoryEntity[]> { return this.ds.getAll(); }
  getById(id: number): Promise<CategoryEntity> { return this.ds.getById(id); }
  update(id: number, dto: UpdateCategoryDto): Promise<CategoryEntity> { return this.ds.update(id, dto); }
  deactivate(id: number): Promise<CategoryEntity> { return this.ds.deactivate(id); }
  activate(id: number): Promise<CategoryEntity> { return this.ds.activate(id); }
}

export class WarehouseRepositoryImpl implements WarehouseRepository {
  constructor(private readonly ds: WarehouseDataSource) { }
  create(dto: CreateWarehouseDto): Promise<WarehouseEntity> { return this.ds.create(dto); }
  getAll(): Promise<WarehouseEntity[]> { return this.ds.getAll(); }
  getById(id: number): Promise<WarehouseEntity> { return this.ds.getById(id); }
  update(id: number, dto: UpdateWarehouseDto): Promise<WarehouseEntity> { return this.ds.update(id, dto); }
  deactivate(id: number): Promise<WarehouseEntity> { return this.ds.deactivate(id); }
}

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly ds: ProductDataSource) { }
  create(dto: CreateProductDto): Promise<ProductEntity> { return this.ds.create(dto); }
  getAll(isActive?: boolean): Promise<ProductEntity[]> { return this.ds.getAll(isActive); }
  getById(id: number): Promise<ProductEntity> { return this.ds.getById(id); }
  update(id: number, dto: UpdateProductDto): Promise<ProductEntity> { return this.ds.update(id, dto); }
  deactivate(id: number): Promise<ProductEntity> { return this.ds.deactivate(id); }
  activate(id: number): Promise<ProductEntity> { return this.ds.activate(id); }
}

export class InventoryRepositoryImpl implements InventoryRepository {
  constructor(private readonly ds: InventoryDataSource) { }
  getAll(filters?: InventoryFilters): Promise<InventoryEntity[]> { return this.ds.getAll(filters); }
  getAlerts(): Promise<InventoryEntity[]> { return this.ds.getAlerts(); }
  getStockForUpdate(productId: number, warehouseId: number): Promise<number> { return this.ds.getStockForUpdate(productId, warehouseId); }
  upsert(productId: number, warehouseId: number, quantity: number): Promise<InventoryEntity> { return this.ds.upsert(productId, warehouseId, quantity); }
  decrementStock(productId: number, warehouseId: number, quantity: number): Promise<InventoryEntity> { return this.ds.decrementStock(productId, warehouseId, quantity); }
}

export class MovementRepositoryImpl implements MovementRepository {
  constructor(private readonly ds: MovementDataSource) { }
  createEntrada(dto: CreateMovementDto, userId: number): Promise<MovementEntity> { return this.ds.createEntrada(dto, userId); }
  createSalida(dto: CreateMovementDto, userId: number): Promise<MovementEntity> { return this.ds.createSalida(dto, userId); }
  getAll(filters?: MovementFilters): Promise<MovementEntity[]> { return this.ds.getAll(filters); }
}
