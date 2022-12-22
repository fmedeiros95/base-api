import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ResetPasswordGuard } from '@/common/guards/reset-password.guard';
import { UserEntity } from '@/database/entities/user.entity';
import { Body, Controller, Ip, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	login(@Body() loginDto: LoginDto, @Ip() ip: string) {
		return this.authService.login(loginDto, ip);
	}

	@Post('forgot-password')
	forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
		return this.authService.forgotPassword(forgotPasswordDto);
	}

	@Patch('reset-password')
	@UseGuards(ResetPasswordGuard)
	resetPassword(
		@CurrentUser() user: UserEntity,
		@Body() resetPasswordDto: ResetPasswordDto,
	) {
		return this.authService.resetPassword(user, resetPasswordDto);
	}
}
