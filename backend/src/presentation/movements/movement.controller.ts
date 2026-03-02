import { Request, Response } from 'express';
import { MovementRepository } from '../../domain/repositories/movement.repository';
import { CreateMovementDto } from '../../domain/dtos/movements/movement.dto';
import { CreateEntrada, CreateSalida, GetMovements } from '../../domain/use-cases/movements/movement.use-case';
import { CustomError } from '../../domain/errors/custom.error';
import { MovementFilters } from '../../domain/datasources/movement.datasource';

export class MovementController {
  constructor(private readonly movementRepository: MovementRepository) { }

  private handleError = (error: unknown, res: Response): void => {
    if (error instanceof CustomError) { res.status(error.statusCode).json({ error: error.message }); return; }
    console.error(error);
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  };

  createEntrada = (req: Request, res: Response): void => {
    const userId = (req.body.user as { id: number }).id;
    const [error, dto] = CreateMovementDto.createEntrada(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }
    new CreateEntrada(this.movementRepository).execute(dto!, userId).then((d) => res.status(201).json(d)).catch((e) => this.handleError(e, res));
  };

  createSalida = (req: Request, res: Response): void => {
    const userId = (req.body.user as { id: number }).id;
    const [error, dto] = CreateMovementDto.createSalida(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }
    new CreateSalida(this.movementRepository).execute(dto!, userId).then((d) => res.status(201).json(d)).catch((e) => this.handleError(e, res));
  };

  getAll = (req: Request, res: Response): void => {
    const { productId, warehouseId, type, from, to } = req.query;
    const filters: MovementFilters = {};
    if (productId) filters.productId = parseInt(productId as string);
    if (warehouseId) filters.warehouseId = parseInt(warehouseId as string);
    if (type === 'ENTRADA' || type === 'SALIDA') filters.type = type;
    if (from) filters.from = from as string;
    if (to) filters.to = to as string;

    new GetMovements(this.movementRepository).execute(filters).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };
}
