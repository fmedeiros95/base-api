import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@IsNotEmpty({ message: 'Email is required' })
	@IsString({ message: 'Email must be a string' })
	@IsEmail({}, { message: 'Invalid email' })
	@ApiProperty()
	email: string;

	@IsNotEmpty({ message: 'Password is required' })
	@IsString({ message: 'Password must be a string' })
	@ApiProperty()
	password: string;
}
