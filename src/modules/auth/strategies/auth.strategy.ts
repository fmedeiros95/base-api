import { UserEntity } from '@/database/entities/user.entity';
import { UserService } from '@/modules/user/user.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'auth') {
	private logger = new Logger(AuthStrategy.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('auth.secret'),
		});
	}

	async validate(payload: IJwtPayload): Promise<UserEntity> {
		const { id, type } = payload;
		if (type !== 'user') throw new UnauthorizedException('Invalid token type');

		const user = await this.userService.findById(id, ['permissions']);
		if (!user) throw new UnauthorizedException('User not found');

		this.logger.debug(`User ${user.id} authenticated`);
		return user;
	}
}
