import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
	const configService = app.get(ConfigService);

	const swaggerConfig = new DocumentBuilder()
		.setTitle(configService.get('app.name'))
		.setDescription(`The ${configService.get('app.name')} API documentation`)
		.setVersion('0.0.1')
		.build();
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('docs', app, document);

	// Apply validation exception filter globally
	app.useGlobalFilters(new ValidationExceptionFilter());

	// Apply validation pipe globally with
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

	// Apply security headers
	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: 'same-site' },
		}),
	);

	// Configure AWS SDK
	config.update({
		accessKeyId: configService.get('storage.awsAccessKeyId'),
		secretAccessKey: configService.get('storage.awsSecretAccessKey'),
		region: configService.get('storage.awsRegion'),
	});

	await app.listen(configService.get('app.port'));
	logger.log(`Application listening on: ${await app.getUrl()}`);
};
bootstrap().catch((error) => {
	logger.error(error);
	process.exit(1);
});
