import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { HasPermission } from '@/common/decorators/permission.decorator';
import { SearchDto } from '@/common/dtos/search.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserEntity } from '@/database/entities/user.entity';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('me')
	@UseGuards(AuthGuard)
	me(@CurrentUser() user: UserEntity) {
		return user;
	}

	@Patch('me/change-avatar')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('avatar'))
	async changeAvatar(
		@UploadedFile() avatar: Express.Multer.File,
		@CurrentUser() user: UserEntity,
	) {
		return this.userService.changeAvatar(avatar, user);
	}

	@Patch('me/change-password')
	@UseGuards(AuthGuard)
	changePassword(
		@CurrentUser() user: UserEntity,
		@Body() changeUserPasswordDto: ChangeUserPasswordDto,
	) {
		return this.userService.changePassword(changeUserPasswordDto, user);
	}

	@Get('avatar/:id([0-9]+)')
	avatar(@Param('id') id: string, @Res() res: Response) {
		return this.userService.avatar(+id, res);
	}

	@Get()
	@HasPermission('users', ['read', 'update'])
	@UseGuards(AuthGuard, PermissionGuard)
	findAll(@Query() searchDto: SearchDto) {
		return this.userService.find(searchDto);
	}

	@Post()
	@HasPermission('users', ['create'])
	@UseGuards(AuthGuard, PermissionGuard)
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get(':id([0-9]+)')
	@HasPermission('users', ['read'])
	@UseGuards(AuthGuard, PermissionGuard)
	findById(@Param('id') id: string) {
		return this.userService.findById(+id);
	}

	@Patch(':id([0-9]+)')
	@HasPermission('users', ['update'])
	@UseGuards(AuthGuard, PermissionGuard)
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}

	@Delete(':id([0-9]+)')
	@HasPermission('users', ['delete'])
	@UseGuards(AuthGuard, PermissionGuard)
	delete(@Param('id') id: string) {
		return this.userService.delete(+id);
	}
}
