import { Exists } from '@/common/decorators/validators/exists.decorator';
import { UserEntity } from '@/database/entities/user.entity';
import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto extends PartialType(UserEntity) {
	@IsNotEmpty({ message: 'Name is required' })
	@IsString({ message: 'Name must be a string' })
	@MinLength(3, { message: 'Name must be at least 3 characters' })
	name: string;

	@IsNotEmpty({ message: 'Email is required' })
	@IsEmail({}, { message: 'Invalid email' })
	@Exists(UserEntity, 'email', { message: 'Email already exists' })
	email: string;

	// @IsNotEmpty({ message: 'Password is required' })
	// @IsString({ message: 'Password must be a string' })
	// @MinLength(6, { message: 'Password must be at least 6 characters' })
	// password: string;
}
