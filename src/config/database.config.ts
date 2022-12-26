import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
	type: process.env.DB_TYPE || 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	schema: process.env.DB_SCHEMA || 'public',
	synchronize: process.env.DB_SYNC === 'true',
	retryAttempts: Number(process.env.DB_RETRY_ATTEMPTS) || 10,
	retryDelay: Number(process.env.DB_RETRY_DELAY) || 3000,
	maxConnections: Number(process.env.DB_MAX_CONNECTIONS) || 100,
}));
