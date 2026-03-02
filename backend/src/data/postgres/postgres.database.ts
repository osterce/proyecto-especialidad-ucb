import { Pool } from 'pg';
import { envs } from '../../config/envs';

export class PostgresDatabase {
  private static instance: PostgresDatabase;
  public readonly pool: Pool;

  private constructor() {
    this.pool = new Pool({
      host: envs.POSTGRES_HOST,
      port: envs.POSTGRES_PORT,
      user: envs.POSTGRES_USER,
      password: envs.POSTGRES_PASSWORD,
      database: envs.POSTGRES_DATABASE,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL pool error:', err);
    });
  }

  static getInstance(): PostgresDatabase {
    if (!PostgresDatabase.instance) {
      PostgresDatabase.instance = new PostgresDatabase();
    }
    return PostgresDatabase.instance;
  }

  async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log('✅ Connected to PostgreSQL');
      client.release();
    } catch (error) {
      console.error('❌ Error connecting to PostgreSQL:', error);
      throw error;
    }
  }
}
