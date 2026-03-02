import { Request, Response, NextFunction } from 'express';
import { JwtAdapter } from '../../config/jwt.adapter';
import { PostgresDatabase } from '../../data/postgres/postgres.database';

interface JwtPayload {
  id: number;
  email: string;
}

export class AuthMiddleware {
  static validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authorization = req.header('Authorization');
    if (!authorization) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    if (!authorization.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid Bearer token format' });
      return;
    }

    const token = authorization.split(' ')[1];

    const payload = await JwtAdapter.validateToken<JwtPayload>(token);
    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Verify user still exists and is active
    try {
      const db = PostgresDatabase.getInstance();
      const result = await db.pool.query(
        `SELECT u.id, u.name, u.email, u.is_active, ARRAY_AGG(r.name) FILTER (WHERE r.name IS NOT NULL) as roles
         FROM users u
         LEFT JOIN user_roles ur ON u.id = ur.user_id
         LEFT JOIN roles r ON ur.role_id = r.id
         WHERE u.id = $1 AND u.is_active = true
         GROUP BY u.id`,
        [payload.id],
      );

      if (result.rows.length === 0) {
        res.status(401).json({ error: 'User not found or inactive' });
        return;
      }

      // Safely initialize req.body for GET requests (no body parsed)
      if (!req.body) req.body = {};
      req.body.user = result.rows[0];
      next();
    } catch (err) {
      console.error('AuthMiddleware error:', err);
      res.status(500).json({ error: 'Auth middleware error' });
    }
  };
}
