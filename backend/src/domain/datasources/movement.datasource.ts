import { CreateMovementDto } from '../dtos/movements/movement.dto';
import { MovementEntity } from '../entities/movement.entity';

export interface MovementFilters {
  productId?: number;
  warehouseId?: number;
  type?: 'ENTRADA' | 'SALIDA';
  from?: string;
  to?: string;
}

export abstract class MovementDataSource {
  abstract createEntrada(dto: CreateMovementDto, userId: number): Promise<MovementEntity>;
  abstract createSalida(dto: CreateMovementDto, userId: number): Promise<MovementEntity>;
  abstract getAll(filters?: MovementFilters): Promise<MovementEntity[]>;
}
