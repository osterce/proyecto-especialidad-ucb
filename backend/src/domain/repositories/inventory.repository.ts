import { InventoryEntity } from '../entities/inventory.entity';
import { InventoryFilters } from '../datasources/inventory.datasource';

export abstract class InventoryRepository {
  abstract getAll(filters?: InventoryFilters): Promise<InventoryEntity[]>;
  abstract getAlerts(): Promise<InventoryEntity[]>;
  abstract getStockForUpdate(productId: number, warehouseId: number): Promise<number>;
  abstract upsert(productId: number, warehouseId: number, quantity: number): Promise<InventoryEntity>;
  abstract decrementStock(productId: number, warehouseId: number, quantity: number): Promise<InventoryEntity>;
}
