import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';

dotenvConfig({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  migrationsRun: true,
  synchronize: false,
  entities: [join(__dirname, './entities/*{.ts,.js}')],
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  url: process.env.DATABASE_URL,
  logging: process.env.NODE_ENV !== 'production',
});
