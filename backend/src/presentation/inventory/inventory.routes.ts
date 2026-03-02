import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from '../../domain/repositories/inventory.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class InventoryRoutes {
  static getRouter(inventoryRepository: InventoryRepository): Router {
    const router = Router();
    const controller = new InventoryController(inventoryRepository);

    router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
    router.get('/alertas', [AuthMiddleware.validateJWT], controller.getAlerts);

    return router;
  }
}
