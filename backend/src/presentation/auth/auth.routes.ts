import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AdminMiddleware } from '../middlewares/admin.middleware';
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export class AuthRoutes {
  static getRouter(authRepository: AuthRepository): Router {
    const router = Router();
    const controller = new AuthController(authRepository);

    // Public routes
    router.post('/register', controller.registerUser);
    router.post('/login', loginLimiter, controller.loginUser);

    // Protected routes (JWT required)
    router.get('/', [AuthMiddleware.validateJWT], controller.getUsers);
    router.put('/update/:id', [AuthMiddleware.validateJWT], controller.updateUser);
    router.delete('/deactivate/:id', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.deactivateUser);
    router.put('/activate/:id', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.activateUser);

    // Admin only
    router.put('/admin/users/:id/roles', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.updateRoles);
    router.put('/admin/users/:id/reset-password', [AuthMiddleware.validateJWT, AdminMiddleware.validateAdmin], controller.resetPassword);

    // Public activate action (No JWT needed, uses email/old_pwd to set new pwd)
    router.post('/activate-account', controller.activateAccount);

    return router;
  }
}
