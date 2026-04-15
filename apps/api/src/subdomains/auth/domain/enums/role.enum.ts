export enum RoleEnum {
  GUEST = 'guest',
  MEMBER = 'member',
  SUBSCRIBER = 'subscriber',
  PRAYER_TEAM = 'prayer_team',
  DATA_OFFICER = 'data_officer',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

/**
 * Role hierarchy — higher roles inherit all permissions of lower roles.
 * super_admin > admin > moderator > data_officer > prayer_team > subscriber > member > guest
 */
export const ADMIN_ROLES = [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.MODERATOR, RoleEnum.DATA_OFFICER];
export const CONTENT_ROLES = [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.MODERATOR];
export const DATA_ROLES = [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.DATA_OFFICER];
export const SYSTEM_ROLES = [RoleEnum.SUPER_ADMIN];
export const WORKER_ROLES = [RoleEnum.SUBSCRIBER, RoleEnum.PRAYER_TEAM, RoleEnum.DATA_OFFICER, RoleEnum.MODERATOR, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN];
