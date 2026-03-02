import { Request, Response, NextFunction } from 'express';

export class AdminMiddleware {
  static validateAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.body.user as { roles: string[] } | undefined;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const roles: string[] = Array.isArray(user.roles) ? user.roles : [];
    if (!roles.includes('ADMIN_ROLE')) {
      res.status(403).json({ error: 'Forbidden - Admin role required' });
      return;
    }

    next();
  };
}
