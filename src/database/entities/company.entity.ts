import { AbstractEntity } from '@/common/abstracts/entity.abstract';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'companies' })
export class CompanyEntity extends AbstractEntity {
	@Column()
	name: string;

	@ManyToOne(() => UserEntity, (user) => user.companies)
	@JoinColumn()
	owner: UserEntity;

	@ManyToMany(() => UserEntity, (user) => user.companies)
	employees: UserEntity[];
}
