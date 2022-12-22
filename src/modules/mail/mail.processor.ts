import { UserEntity } from '@/database/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import {
	Processor,
	Process,
	OnQueueActive,
	OnQueueFailed,
	OnQueueCompleted,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as moment from 'moment';

const { APP_NAME, FRONTEND_DOMAIN } = process.env;
@Processor('MailQueue')
export class MailProcessor {
	private logger = new Logger(MailProcessor.name);
	private defaultContext = {
		app_name: APP_NAME,
		app_url: FRONTEND_DOMAIN,
		current: {
			date: moment().format('DD/MM/YYYY'),
			time: moment().format('HH:mm:ss'),
			year: moment().format('YYYY'),
		},
	};

	constructor(private readonly mailerService: MailerService) {}

	@OnQueueActive()
	onActive(job: Job) {
		this.logger.log(
			`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
				job.data,
			)}`,
		);
	}

	@OnQueueCompleted()
	onCompleted(job: Job, result: any) {
		this.logger.log(
			`Completed job ${job.id} of type ${job.name} with result ${result}`,
		);
	}

	@OnQueueFailed()
	onFailed(job: Job, error: Error) {
		this.logger.error(`Job ${job.id} failed: ${error.message}`);
	}

	@Process('welcome')
	async sendWelcome(job: Job<{ user: UserEntity; password: string }>) {
		const { user, password } = job.data;

		await this.mailerService.sendMail({
			to: user.email,
			subject: 'Welcome',
			template: './user/welcome',
			context: {
				...this.defaultContext,
				user: { ...user, password },
				url: FRONTEND_DOMAIN.concat(`/auth/login`),
			},
		});
	}

	@Process('reset-password')
	async sendResetPassword(job: Job<{ user: UserEntity; token: string }>) {
		const { user, token } = job.data;
		console.log(user, token);

		await this.mailerService.sendMail({
			to: user.email,
			subject: 'Reset Password',
			template: './auth/reset-password',
			context: {
				...this.defaultContext,
				user,
				token,
				url: FRONTEND_DOMAIN.concat(`/auth/reset-password?token=${token}`),
			},
		});

		return;
	}

	@Process('password-changed')
	async sendPasswordChanged(job: Job<{ user: UserEntity }>) {
		const { user } = job.data;

		await this.mailerService.sendMail({
			to: user.email,
			subject: 'Password Changed',
			template: './user/password-changed',
			context: {
				...this.defaultContext,
				user,
				url: FRONTEND_DOMAIN.concat(`/auth/login`),
			},
		});
	}
}
