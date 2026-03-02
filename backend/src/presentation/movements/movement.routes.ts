import { Router } from 'express';
import { MovementController } from './movement.controller';
import { MovementRepository } from '../../domain/repositories/movement.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class MovementRoutes {
  static getRouter(movementRepository: MovementRepository): Router {
    const router = Router();
    const controller = new MovementController(movementRepository);

    router.get('/', [AuthMiddleware.validateJWT], controller.getAll);
    router.post('/entradas', [AuthMiddleware.validateJWT], controller.createEntrada);
    router.post('/salidas', [AuthMiddleware.validateJWT], controller.createSalida);

    return router;
  }
}
