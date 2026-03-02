import { Request, Response } from 'express';
import { InventoryRepository } from '../../domain/repositories/inventory.repository';
import { GetInventory, GetStockAlerts } from '../../domain/use-cases/inventory/inventory.use-case';
import { InventoryFilters } from '../../domain/datasources/inventory.datasource';
import { CustomError } from '../../domain/errors/custom.error';

export class InventoryController {
  constructor(private readonly inventoryRepository: InventoryRepository) { }

  private handleError = (error: unknown, res: Response): void => {
    if (error instanceof CustomError) { res.status(error.statusCode).json({ error: error.message }); return; }
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  };

  getAll = (req: Request, res: Response): void => {
    const { productId, warehouseId } = req.query;
    const filters: InventoryFilters = {};
    if (productId) filters.productId = parseInt(productId as string);
    if (warehouseId) filters.warehouseId = parseInt(warehouseId as string);

    new GetInventory(this.inventoryRepository).execute(filters).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  getAlerts = (_req: Request, res: Response): void => {
    new GetStockAlerts(this.inventoryRepository).execute().then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };
}
