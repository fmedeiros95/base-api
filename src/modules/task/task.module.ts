import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserSchedule } from './schedules/user.schedule';

@Module({
	imports: [UserModule],
	// providers: [UserSchedule],
})
export class TaskModule {}
