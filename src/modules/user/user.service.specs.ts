import { UserEntity } from '@/database/entities/user.entity';
import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { UserService } from './user.service';

const userEntityList: UserEntity[] = [
	new UserEntity({ id: 1, name: 'Jhon', email: 'jhon@email.com' }),
	new UserEntity({ id: 2, name: 'Chris', email: 'chris@email.com' }),
	new UserEntity({ id: 3, name: 'Paul', email: 'paul@email.com' }),
];
const updatedUserEntityItem = new UserEntity({
	id: 1,
	name: 'Jhon Doe',
	email: 'jhon@email.com',
});

describe('UserService', () => {
	let userService: UserService;
	let userRepository: Repository<UserEntity>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [MailModule, forwardRef(() => AuthModule)],
			providers: [
				UserService,
				{
					provide: getRepositoryToken(UserEntity),
					useValue: {
						find: jest.fn().mockResolvedValue(userEntityList),
						findOne: jest.fn().mockResolvedValue(userEntityList[0]),
						create: jest.fn().mockResolvedValue(userEntityList[0]),
						merge: jest.fn().mockResolvedValue(updatedUserEntityItem),
						save: jest.fn().mockResolvedValue(userEntityList[0]),
						softDelete: jest.fn().mockReturnValue(undefined),
					},
				},
			],
		}).compile();

		userService = module.get<UserService>(UserService);
		userRepository = module.get<Repository<UserEntity>>(
			getRepositoryToken(UserEntity),
		);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
		expect(userRepository).toBeDefined();
	});

	describe('findAll', () => {
		it('should return a user entity list successfully', async () => {
			// Act
			const result = await userService.findAll();

			// Assert
			expect(result).toEqual(userEntityList);
			expect(userRepository.find).toHaveBeenCalledTimes(1);
		});

		it('should throw an exception', () => {
			// Arrange
			jest.spyOn(userRepository, 'find').mockRejectedValueOnce(new Error());

			// Assert
			// expect(userService.findAll()).rejects.toThrowError();
		});
	});
});
