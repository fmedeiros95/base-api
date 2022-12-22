import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, MiddlewareBuilder } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';

import { GenericExceptionsFilter } from './common/filters/generic.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// Config files
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import mailConfig from './config/mail.config';
import redisConfig from './config/redis.config';
import storageConfig from './config/storage.config';
import throttlerConfig from './config/throttler.config';

import { TypeOrmConfigService } from './database/typeorm-config.service';

import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';

@Module({
	controllers: [AppController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				appConfig,
				authConfig,
				databaseConfig,
				mailConfig,
				redisConfig,
				storageConfig,
				throttlerConfig,
			],
			envFilePath: ['.env'],
		}),
		ScheduleModule.forRoot(),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigService,
			dataSourceFactory: (options) => {
				return new DataSource(options).initialize();
			},
		}),
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				redis: {
					host: configService.get('redis.host'),
					port: configService.get('redis.port'),
					password: configService.get('redis.pass'),
				},
			}),
			inject: [ConfigService],
		}),
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				ttl: configService.get('throttler.ttl'),
				limit: configService.get('throttler.limit'),
			}),
			inject: [ConfigService],
		}),

		MailModule,
		TaskModule,
		AuthModule,
		UserModule,
	],
	providers: [
		{ provide: APP_FILTER, useClass: GenericExceptionsFilter },
		{ provide: APP_FILTER, useClass: HttpExceptionFilter },
		{ provide: APP_GUARD, useClass: ThrottlerGuard },
	],
})
export class AppModule {
	constructor(@InjectQueue('MailQueue') private mailQueue: Queue) {}

	configure(consumer: MiddlewareBuilder) {
		const { router } = createBullBoard([new BullAdapter(this.mailQueue)]);
		consumer.apply(router).forRoutes('/app-queues');
	}
}
