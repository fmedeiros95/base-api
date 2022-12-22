import { UserService } from '@/modules/user/user.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserSchedule {
	private readonly logger = new Logger(UserSchedule.name);

	constructor(private readonly userService: UserService) {}

	@Cron('*/5 * * * * *')
	async handleCron() {
		const total = await this.userService.countAll();
		this.logger.debug(`Users: ${total}`);
		this.logger.debug('Called when the current second is 5');
	}
}
