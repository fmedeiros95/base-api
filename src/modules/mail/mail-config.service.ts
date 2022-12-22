import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class MailConfigService implements MailerOptionsFactory {
	constructor(private configService: ConfigService) {}

	createMailerOptions(): MailerOptions {
		return {
			transport: {
				host: this.configService.get('mail.host'),
				port: this.configService.get('mail.port'),
				secure: this.configService.get('mail.secure'),
				auth: {
					user: this.configService.get('mail.user'),
					pass: this.configService.get('mail.password'),
				},
			},
			defaults: {
				from: `"${this.configService.get(
					'app.name',
				)}" <${this.configService.get('mail.defaultFrom')}>`,
			},
			template: {
				dir: path.join(__dirname, 'templates'),
				adapter: new HandlebarsAdapter(),
				options: { strict: true },
			},
		} as MailerOptions;
	}
}
