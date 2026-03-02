import 'dotenv/config';
import { PostgresDatabase } from './data/postgres/postgres.database';
import { Server } from './presentation/server';

async function main(): Promise<void> {
  // 1. Connect to database
  const db = PostgresDatabase.getInstance();
  await db.connect();

  // 2. Start HTTP server
  const server = new Server();
  server.start();
}

main().catch((error) => {
  console.error('Fatal error during startup:', error);
  process.exit(1);
});
