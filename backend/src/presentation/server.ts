import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppRoutes } from './routes';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { envs } from '../config/envs';

export class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    // Security headers (OWASP A05)
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: envs.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );

    // Global rate limit (OWASP A07)
    const globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 300,
      message: { error: 'Too many requests, please try again later' },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(globalLimiter);

    // Body parsing
    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Trust proxy (for rate limiting behind reverse proxy)
    this.app.set('trust proxy', 1);
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api', AppRoutes.getRouter());

    // 404 handler
    this.app.use((_req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Error handler (must be last)
    this.app.use(ErrorMiddleware.handle);
  }

  start(): void {
    this.app.listen(envs.PORT, () => {
      console.log(`\n🚀 Server running on port ${envs.PORT}`);
      console.log(`📌 Environment: ${envs.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${envs.PORT}/health`);
      console.log(`📡 API Base: http://localhost:${envs.PORT}/api`);
    });
  }
}
