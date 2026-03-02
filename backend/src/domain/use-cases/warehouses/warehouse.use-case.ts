import { CreateWarehouseDto, UpdateWarehouseDto } from '../../dtos/warehouses/warehouse.dto';
import { WarehouseRepository } from '../../repositories/warehouse.repository';
import { WarehouseEntity } from '../../entities/warehouse.entity';

export class CreateWarehouse {
  constructor(private readonly warehouseRepository: WarehouseRepository) { }
  execute(dto: CreateWarehouseDto) { return this.warehouseRepository.create(dto); }
}

export class GetWarehouses {
  constructor(private readonly warehouseRepository: WarehouseRepository) { }
  execute(): Promise<WarehouseEntity[]> { return this.warehouseRepository.getAll(); }
}

export class UpdateWarehouse {
  constructor(private readonly warehouseRepository: WarehouseRepository) { }
  execute(id: number, dto: UpdateWarehouseDto) { return this.warehouseRepository.update(id, dto); }
}

export class DeactivateWarehouse {
  constructor(private readonly warehouseRepository: WarehouseRepository) { }
  execute(id: number) { return this.warehouseRepository.deactivate(id); }
}
