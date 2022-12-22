import { UserEntity } from '@/database/entities/user.entity';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
	private logger = new Logger(MailService.name);

	constructor(@InjectQueue('MailQueue') private mailQueue: Queue) {}

	sendWelcome(user: UserEntity, password: string) {
		this.logger.debug(`Adding job to queue: welcome - ${user.email}`);
		return this.mailQueue.add('welcome', { user, password });
	}

	sendResetPassword(user: UserEntity, token: string) {
		this.logger.debug(`Adding job to queue: reset-password - ${user.email}`);
		return this.mailQueue.add('reset-password', { user, token });
	}

	sendPasswordChanged(user: UserEntity) {
		this.logger.debug(`Adding job to queue: password-changed - ${user.email}`);
		return this.mailQueue.add('password-changed', { user });
	}
}
