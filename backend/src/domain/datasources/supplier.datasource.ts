import { CreateSupplierDto, UpdateSupplierDto } from '../dtos/suppliers/supplier.dto';
import { SupplierEntity } from '../entities/supplier.entity';

export abstract class SupplierDataSource {
  abstract create(dto: CreateSupplierDto): Promise<SupplierEntity>;
  abstract getAll(): Promise<SupplierEntity[]>;
  abstract getById(id: number): Promise<SupplierEntity>;
  abstract update(id: number, dto: UpdateSupplierDto): Promise<SupplierEntity>;
  abstract deactivate(id: number): Promise<SupplierEntity>;
}
