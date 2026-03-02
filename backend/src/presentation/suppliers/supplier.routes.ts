import { Router } from 'express';
import { SupplierController } from './supplier.controller';
import { SupplierRepository } from '../../domain/repositories/supplier.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AdminMiddleware } from '../middlewares/admin.middleware';

export class SupplierRoutes {
  static getRouter(supplierRepository: SupplierRepository): Router {
    const router = Router();
    const controller = new SupplierController(supplierRepository);

    router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
    router.post('/', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.create);
    router.put('/:id', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.update);
    router.delete('/:id', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.deactivate);

    return router;
  }
}
