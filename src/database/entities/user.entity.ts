import { AbstractEntity } from '@/common/abstracts/entity.abstract';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
} from 'typeorm';
import { UserPermissionEntity } from './user-permission.entity';
import * as bcrypt from 'bcrypt';
import { CompanyEntity } from './company.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
	@Column()
	name: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column({ nullable: true })
	phone: string;

	@Column({ nullable: true })
	avatar: string;

	@Column({ nullable: true })
	lastChangePassword: Date;

	@Column({ nullable: true })
	passwordResetToken: string;

	@OneToMany(() => UserPermissionEntity, (permission) => permission.user)
	permissions: UserPermissionEntity;

	@OneToMany(() => CompanyEntity, (company) => company.owner)
	companies: CompanyEntity[];

	@ManyToMany(() => CompanyEntity, (company) => company.employees)
	@JoinTable({
		name: 'company_employees',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'company_id', referencedColumnName: 'id' },
	})
	employeeOf: CompanyEntity[];

	@BeforeInsert()
	@BeforeUpdate()
	hashPassword() {
		if (this.password) {
			this.password = bcrypt.hashSync(this.password, 8);
		}
	}

	checkPassword(password: string) {
		return bcrypt.compareSync(password, this.password);
	}

	toJSON() {
		const obj = { ...this };
		delete obj.password;
		delete obj.passwordResetToken;

		return obj;
	}

	constructor(partial: Partial<UserEntity>) {
		super();
		Object.assign(this, partial);
	}
}
