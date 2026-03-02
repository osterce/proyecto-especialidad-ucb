const VALID_ROLES = ['ADMIN_ROLE', 'USER_ROLE', 'WAREHOUSE_ROLE'];

export class UpdateRolesDto {
  private constructor(public readonly roles: string[]) { }

  static create(body: Record<string, unknown>): [string?, UpdateRolesDto?] {
    const { roles } = body;

    if (!roles || !Array.isArray(roles)) return ['Roles must be an array'];
    if (roles.length === 0) return ['At least one role is required'];
    if (!roles.every((r) => VALID_ROLES.includes(r))) return [`Invalid role. Valid roles: ${VALID_ROLES.join(', ')}`];

    return [undefined, new UpdateRolesDto(roles)];
  }
}
