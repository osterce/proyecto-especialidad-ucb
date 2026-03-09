import { CreateWarehouseDto, UpdateWarehouseDto } from '../dtos/warehouses/warehouse.dto';
import { WarehouseEntity } from '../entities/warehouse.entity';

export abstract class WarehouseDataSource {
  abstract create(dto: CreateWarehouseDto): Promise<WarehouseEntity>;
  abstract getAll(): Promise<WarehouseEntity[]>;
  abstract getById(id: number): Promise<WarehouseEntity>;
  abstract update(id: number, dto: UpdateWarehouseDto): Promise<WarehouseEntity>;
  abstract deactivate(id: number): Promise<WarehouseEntity>;
  abstract activate(id: number): Promise<WarehouseEntity>;
}
