import { Request, Response } from 'express';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from '../../domain/dtos/products/product.dto';
import { CreateProduct, GetProducts, GetProductById, UpdateProduct, DeactivateProduct, ActivateProduct } from '../../domain/use-cases/products/product.use-case';
import { CustomError } from '../../domain/errors/custom.error';

export class ProductController {
  constructor(private readonly productRepository: ProductRepository) { }

  private handleError = (error: unknown, res: Response): void => {
    if (error instanceof CustomError) { res.status(error.statusCode).json({ error: error.message }); return; }
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  };

  create = (req: Request, res: Response): void => {
    const [error, dto] = CreateProductDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }
    new CreateProduct(this.productRepository).execute(dto!).then((d) => res.status(201).json(d)).catch((e) => this.handleError(e, res));
  };

  getAll = (req: Request, res: Response): void => {
    const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
    new GetProducts(this.productRepository).execute(isActive).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  getById = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    new GetProductById(this.productRepository).execute(id).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  update = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    const [error, dto] = UpdateProductDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }
    new UpdateProduct(this.productRepository).execute(id, dto!).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  deactivate = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    new DeactivateProduct(this.productRepository).execute(id).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  activate = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    new ActivateProduct(this.productRepository).execute(id).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };
}
