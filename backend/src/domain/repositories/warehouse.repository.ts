import { CreateWarehouseDto, UpdateWarehouseDto } from '../dtos/warehouses/warehouse.dto';
import { WarehouseEntity } from '../entities/warehouse.entity';

export abstract class WarehouseRepository {
  abstract create(dto: CreateWarehouseDto): Promise<WarehouseEntity>;
  abstract getAll(isActive?: boolean): Promise<WarehouseEntity[]>;
  abstract getById(id: number): Promise<WarehouseEntity>;
  abstract update(id: number, dto: UpdateWarehouseDto): Promise<WarehouseEntity>;
  abstract deactivate(id: number): Promise<WarehouseEntity>;
  abstract activate(id: number): Promise<WarehouseEntity>;
}
