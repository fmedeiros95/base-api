import { SetMetadata } from '@nestjs/common';

export const HasPermission = (entity: string, permissions: string[]) =>
	SetMetadata('permissions', {
		entity,
		permissions,
	});
