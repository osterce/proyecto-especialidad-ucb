import { Request, Response, NextFunction } from 'express';

export class WarehouseMiddleware {
  static validateWarehouse = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.body.user as { roles: string[] } | undefined;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const roles: string[] = Array.isArray(user.roles) ? user.roles : [];

    // We allow either WAREHOUSE_ROLE or ADMIN_ROLE to perform warehouse transactions
    if (!roles.includes('WAREHOUSE_ROLE') && !roles.includes('ADMIN_ROLE')) {
      res.status(403).json({ error: 'Forbidden - Warehouse or Admin role required' });
      return;
    }

    next();
  };
}
