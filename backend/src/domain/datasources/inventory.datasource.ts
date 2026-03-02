import { InventoryEntity } from '../entities/inventory.entity';

export interface InventoryFilters {
  productId?: number;
  warehouseId?: number;
}

export abstract class InventoryDataSource {
  abstract getAll(filters?: InventoryFilters): Promise<InventoryEntity[]>;
  abstract getAlerts(): Promise<InventoryEntity[]>;
  abstract getStockForUpdate(productId: number, warehouseId: number): Promise<number>;
  abstract upsert(productId: number, warehouseId: number, quantity: number): Promise<InventoryEntity>;
  abstract decrementStock(productId: number, warehouseId: number, quantity: number): Promise<InventoryEntity>;
}
