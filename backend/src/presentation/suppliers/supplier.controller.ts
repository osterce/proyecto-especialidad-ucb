import { Request, Response } from 'express';
import { SupplierRepository } from '../../domain/repositories/supplier.repository';
import { CreateSupplierDto, UpdateSupplierDto } from '../../domain/dtos/suppliers/supplier.dto';
import { CreateSupplier, GetSuppliers, UpdateSupplier, DeactivateSupplier } from '../../domain/use-cases/suppliers/supplier.use-case';
import { CustomError } from '../../domain/errors/custom.error';

export class SupplierController {
  constructor(private readonly supplierRepository: SupplierRepository) { }

  private handleError = (error: unknown, res: Response): void => {
    if (error instanceof CustomError) { res.status(error.statusCode).json({ error: error.message }); return; }
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  };

  create = (req: Request, res: Response): void => {
    const [error, dto] = CreateSupplierDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }
    new CreateSupplier(this.supplierRepository).execute(dto!).then((d) => res.status(201).json(d)).catch((e) => this.handleError(e, res));
  };

  getAll = (_req: Request, res: Response): void => {
    new GetSuppliers(this.supplierRepository).execute().then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  update = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    const [error, dto] = UpdateSupplierDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }
    new UpdateSupplier(this.supplierRepository).execute(id, dto!).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  deactivate = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    new DeactivateSupplier(this.supplierRepository).execute(id).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };
}
