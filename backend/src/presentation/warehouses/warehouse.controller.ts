import { Request, Response } from 'express';
import { WarehouseRepository } from '../../domain/repositories/warehouse.repository';
import { CreateWarehouseDto, UpdateWarehouseDto } from '../../domain/dtos/warehouses/warehouse.dto';
import { CreateWarehouse, GetWarehouses, UpdateWarehouse, DeactivateWarehouse, ActivateWarehouse } from '../../domain/use-cases/warehouses/warehouse.use-case';
import { CustomError } from '../../domain/errors/custom.error';

export class WarehouseController {
  constructor(private readonly warehouseRepository: WarehouseRepository) { }

  private handleError = (error: unknown, res: Response): void => {
    if (error instanceof CustomError) { res.status(error.statusCode).json({ error: error.message }); return; }
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  };

  create = (req: Request, res: Response): void => {
    const [error, dto] = CreateWarehouseDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }
    new CreateWarehouse(this.warehouseRepository).execute(dto!).then((d) => res.status(201).json(d)).catch((e) => this.handleError(e, res));
  };

  getAll = (req: Request, res: Response): void => {
    let isActive: boolean | undefined = undefined;
    if (req.query["isActive"] !== undefined) {
      isActive = req.query["isActive"] === 'true';
    }
    new GetWarehouses(this.warehouseRepository).execute(isActive).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  update = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    const [error, dto] = UpdateWarehouseDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }
    new UpdateWarehouse(this.warehouseRepository).execute(id, dto!).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  deactivate = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    new DeactivateWarehouse(this.warehouseRepository).execute(id).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  activate = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    new ActivateWarehouse(this.warehouseRepository).execute(id).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };
}
