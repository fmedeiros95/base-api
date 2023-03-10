import { UserPermissionEntity } from '@/database/entities/user-permission.entity';
import { UserEntity } from '@/database/entities/user.entity';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
	private logger = new Logger(PermissionGuard.name);

	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const { entity, permissions } = this.reflector.get<{
			entity: string;
			permissions: string[];
		}>('permissions', context.getHandler());
		if (!permissions) return true;

		const request = context.switchToHttp().getRequest();
		const user = request.user as UserEntity;
		if (!user) return false;

		// Get user permissions by route
		const userPermission =
			user?.permissions &&
			Object.values(user?.permissions).find(
				(permission) => permission.entity === entity,
			);
		if (!userPermission) return false;

		// Log user, route and permission
		this.logger.log(
			`User: ${user.id} | Entity: ${entity} | Permission: ${JSON.stringify(
				userPermission,
			)}`,
		);

		// Check if user has permission to access this route
		return this.matchRoles(permissions, userPermission);
	}

	private matchRoles(
		roles: string[],
		userPermission: UserPermissionEntity,
	): boolean {
		for (const role of roles) {
			if (!userPermission[role]) {
				return false;
			}
		}

		return true;
	}
}
