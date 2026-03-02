import { CreateMovementDto } from '../../dtos/movements/movement.dto';
import { MovementRepository } from '../../repositories/movement.repository';
import { MovementFilters } from '../../datasources/movement.datasource';
import { MovementEntity } from '../../entities/movement.entity';

export class CreateEntrada {
  constructor(private readonly movementRepository: MovementRepository) { }
  execute(dto: CreateMovementDto, userId: number): Promise<MovementEntity> {
    return this.movementRepository.createEntrada(dto, userId);
  }
}

export class CreateSalida {
  constructor(private readonly movementRepository: MovementRepository) { }
  execute(dto: CreateMovementDto, userId: number): Promise<MovementEntity> {
    return this.movementRepository.createSalida(dto, userId);
  }
}

export class GetMovements {
  constructor(private readonly movementRepository: MovementRepository) { }
  execute(filters?: MovementFilters): Promise<MovementEntity[]> {
    return this.movementRepository.getAll(filters);
  }
}
