import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from './UserRole.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
