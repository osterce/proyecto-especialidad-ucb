import { Router } from 'express';
import { CategoryController } from './category.controller';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AdminMiddleware } from '../middlewares/admin.middleware';

export class CategoryRoutes {
  static getRouter(categoryRepository: CategoryRepository): Router {
    const router = Router();
    const controller = new CategoryController(categoryRepository);

    router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
    router.post('/', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.create);
    router.put('/:id', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.update);
    router.delete('/:id', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.deactivate);

    return router;
  }
}
