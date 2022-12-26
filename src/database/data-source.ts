import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

const {
	DB_HOST = 'localhost',
	DB_PORT = 5432,
	DB_USER = 'postgres',
	DB_PASS = 'postgres',
	DB_NAME = 'nestjs',
	DB_SCHEMA = 'public',
	DB_SYNC = false,
	DB_RETRY_ATTEMPTS = 10,
	DB_RETRY_DELAY = 3000,
} = process.env;

export const typeOrmOptions: TypeOrmModuleOptions = {
	type: 'postgres',
	host: DB_HOST,
	port: Number(DB_PORT) || 5432,
	username: DB_USER,
	password: DB_PASS,
	database: DB_NAME,
	schema: DB_SCHEMA,
	synchronize: Boolean(DB_SYNC === 'true') || false,
	retryAttempts: Number(DB_RETRY_ATTEMPTS) || 10,
	retryDelay: Number(DB_RETRY_DELAY) || 3000,
	entities: [
		join(__dirname, '/entities/*.entity{.ts,.js}'),
		join(__dirname, '/../modules/**/entities/*.entity{.ts,.js}'),
	],
	subscribers: [
		join(__dirname, '/subscribers/*{.ts,.js}'),
		join(__dirname, '/../modules/**/subscribers/*{.ts,.js}'),
	],
	migrations: [
		join(__dirname, '/migrations/*{.ts,.js}'),
		join(__dirname, '/../modules/**/migrations/*{.ts,.js}'),
	],
};

export default new DataSource(typeOrmOptions as DataSourceOptions);
