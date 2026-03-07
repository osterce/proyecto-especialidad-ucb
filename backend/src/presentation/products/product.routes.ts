import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AdminMiddleware } from '../middlewares/admin.middleware';

export class ProductRoutes {
  static getRouter(productRepository: ProductRepository): Router {
    const router = Router();
    const controller = new ProductController(productRepository);

    router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
    router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
    router.post('/', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.create);
    router.put('/:id', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.update);
    router.delete('/:id', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.deactivate);
    router.put('/:id/activate', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.activate);

    return router;
  }
}
