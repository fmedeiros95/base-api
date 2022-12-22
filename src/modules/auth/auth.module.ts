import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategies/auth.strategy';
import { ResetPasswordStrategy } from './strategies/reset-password.strategy';

@Module({
	imports: [
		MailModule,
		UserModule,
		PassportModule.register({ property: 'user' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('auth.secret'),
				signOptions: {
					expiresIn: configService.get('auth.expires'),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, AuthStrategy, ResetPasswordStrategy],
	exports: [AuthStrategy, ResetPasswordStrategy, PassportModule],
})
export class AuthModule {}
