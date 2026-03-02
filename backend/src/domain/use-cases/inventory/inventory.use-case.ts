import { InventoryRepository } from '../../repositories/inventory.repository';
import { InventoryFilters } from '../../datasources/inventory.datasource';
import { InventoryEntity } from '../../entities/inventory.entity';

export class GetInventory {
  constructor(private readonly inventoryRepository: InventoryRepository) { }
  execute(filters?: InventoryFilters): Promise<InventoryEntity[]> {
    return this.inventoryRepository.getAll(filters);
  }
}

export class GetStockAlerts {
  constructor(private readonly inventoryRepository: InventoryRepository) { }
  execute(): Promise<InventoryEntity[]> {
    return this.inventoryRepository.getAlerts();
  }
}
