import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('database', () => ({
	type: process.env.DB_TYPE || 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	schema: process.env.DB_SCHEMA || 'public',
	synchronize: process.env.DB_SYNCHRONIZE === 'true',
	retryAttempts: Number(process.env.DB_RETRY_ATTEMPTS) || 10,
	retryDelay: Number(process.env.DB_RETRY_DELAY) || 3000,
	maxConnections: Number(process.env.DB_MAX_CONNECTIONS) || 100,
	entities: [join(__dirname, '/entities/*')],
	subscribers: [join(__dirname, '/subscribers/*')],
	migrations: [join(__dirname, '/migrations/*')],
}));
