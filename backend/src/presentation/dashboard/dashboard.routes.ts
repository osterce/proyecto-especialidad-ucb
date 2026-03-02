import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class DashboardRoutes {
  static getRouter(): Router {
    const router = Router();
    const controller = new DashboardController();

    router.get('/', [AuthMiddleware.validateJWT], controller.getDashboard);

    return router;
  }
}
