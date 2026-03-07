import { Request, Response } from 'express';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../../domain/dtos/categories/category.dto';
import { CreateCategory, GetCategories, UpdateCategory, DeactivateCategory, ActivateCategory } from '../../domain/use-cases/categories/category.use-case';
import { CustomError } from '../../domain/errors/custom.error';

export class CategoryController {
  constructor(private readonly categoryRepository: CategoryRepository) { }

  private handleError = (error: unknown, res: Response): void => {
    if (error instanceof CustomError) { res.status(error.statusCode).json({ error: error.message }); return; }
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  };

  create = (req: Request, res: Response): void => {
    const [error, dto] = CreateCategoryDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }
    new CreateCategory(this.categoryRepository).execute(dto!).then((d) => res.status(201).json(d)).catch((e) => this.handleError(e, res));
  };

  getAll = (req: Request, res: Response): void => {
    let isActive: boolean | undefined;
    if (req.query.isActive !== undefined) {
      isActive = req.query.isActive === 'true';
    }
    new GetCategories(this.categoryRepository).execute(isActive).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  update = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    const [error, dto] = UpdateCategoryDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }
    new UpdateCategory(this.categoryRepository).execute(id, dto!).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  deactivate = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    new DeactivateCategory(this.categoryRepository).execute(id).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };

  activate = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    new ActivateCategory(this.categoryRepository).execute(id).then((d) => res.json(d)).catch((e) => this.handleError(e, res));
  };
}
