import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain/errors/custom.error';

export class ErrorMiddleware {
  static handle = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error('Unexpected error:', error);
    const isDev = process.env.NODE_ENV === 'development';
    const message = isDev && error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  };
}
