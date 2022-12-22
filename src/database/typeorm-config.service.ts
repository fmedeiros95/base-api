import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	constructor(private configService: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: this.configService.get('database.type'),
			host: this.configService.get('database.host'),
			port: this.configService.get('database.port'),
			username: this.configService.get('database.username'),
			password: this.configService.get('database.password'),
			database: this.configService.get('database.name'),
			schema: this.configService.get('database.schema'),
			synchronize: this.configService.get('database.synchronize'),
			retryAttempts: this.configService.get('database.retryAttempts'),
			retryDelay: this.configService.get('database.retryDelay'),
			entities: [join(__dirname, '/entities/*.entity{.ts,.js}')],
			subscribers: [join(__dirname, '/subscribers/*{.ts,.js}')],
			migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
			keepConnectionAlive: true,
			logging: this.configService.get('app.nodeEnv') !== 'production',
			extra: {
				max: this.configService.get('database.maxConnections'),
			},
		} as TypeOrmModuleOptions;
	}
}
