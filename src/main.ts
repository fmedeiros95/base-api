import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { ValidationError } from 'class-validator';
import { ValidationException } from './common/exceptions/validation.exception';

const logger = new Logger('Bootstrap');
const bootstrap = async () => {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.useGlobalFilters(new ValidationExceptionFilter());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			exceptionFactory: (errors: ValidationError[]) => {
				const messages: string[] = [];
				errors.map((error) => {
					const constraints = Object.values(error.constraints);
					messages.push(...constraints);
				});
				return new ValidationException(messages);
			},
		}),
	);
	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: 'same-site' },
		}),
	);

	const configService = app.get(ConfigService);
	config.update({
		accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
		secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
		region: configService.get<string>('AWS_REGION'),
	});

	await app.listen(configService.get<number>('APP_PORT') || 3000);
	logger.log(`Application listening on: ${await app.getUrl()}`);
};
bootstrap().catch((error) => {
	logger.error(error);
	process.exit(1);
});
