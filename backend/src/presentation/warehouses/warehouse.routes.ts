import { Router } from 'express';
import { WarehouseController } from './warehouse.controller';
import { WarehouseRepository } from '../../domain/repositories/warehouse.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AdminMiddleware } from '../middlewares/admin.middleware';

export class WarehouseRoutes {
  static getRouter(warehouseRepository: WarehouseRepository): Router {
    const router = Router();
    const controller = new WarehouseController(warehouseRepository);

    router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
    router.post('/', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.create);
    router.put('/:id', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.update);
    router.delete('/:id', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.deactivate);
    router.put('/:id/activate', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.activate);

    return router;
  }
}
