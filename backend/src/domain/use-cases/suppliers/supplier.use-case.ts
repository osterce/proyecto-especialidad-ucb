import { CreateSupplierDto, UpdateSupplierDto } from '../../dtos/suppliers/supplier.dto';
import { SupplierRepository } from '../../repositories/supplier.repository';
import { SupplierEntity } from '../../entities/supplier.entity';

export class CreateSupplier {
  constructor(private readonly supplierRepository: SupplierRepository) { }
  execute(dto: CreateSupplierDto) { return this.supplierRepository.create(dto); }
}

export class GetSuppliers {
  constructor(private readonly supplierRepository: SupplierRepository) { }
  execute(): Promise<SupplierEntity[]> { return this.supplierRepository.getAll(); }
}

export class UpdateSupplier {
  constructor(private readonly supplierRepository: SupplierRepository) { }
  execute(id: number, dto: UpdateSupplierDto) { return this.supplierRepository.update(id, dto); }
}

export class DeactivateSupplier {
  constructor(private readonly supplierRepository: SupplierRepository) { }
  execute(id: number) { return this.supplierRepository.deactivate(id); }
}
