import { CreateMovementDto } from '../dtos/movements/movement.dto';
import { MovementEntity } from '../entities/movement.entity';
import { MovementFilters } from '../datasources/movement.datasource';

export abstract class MovementRepository {
  abstract createEntrada(dto: CreateMovementDto, userId: number): Promise<MovementEntity>;
  abstract createSalida(dto: CreateMovementDto, userId: number): Promise<MovementEntity>;
  abstract getAll(filters?: MovementFilters): Promise<MovementEntity[]>;
}
