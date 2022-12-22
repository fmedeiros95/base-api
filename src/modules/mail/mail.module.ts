import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailConfigService } from './mail-config.service';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
	imports: [
		BullModule.registerQueue({ name: 'MailQueue' }),
		MailerModule.forRootAsync({
			useClass: MailConfigService,
		}),
	],
	providers: [MailProcessor, MailService],
	exports: [MailService, MailProcessor, BullModule],
})
export class MailModule {}
