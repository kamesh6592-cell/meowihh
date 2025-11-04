import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';

// Load environment variables
config({ path: '.env.local' });

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  console.log('🚀 Running migrations...');
  console.log('📦 Database URL:', process.env.DATABASE_URL.split('@')[1]); // Hide credentials

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  try {
    await migrate(db, { migrationsFolder: './drizzle/migrations' });
    console.log('✅ Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
