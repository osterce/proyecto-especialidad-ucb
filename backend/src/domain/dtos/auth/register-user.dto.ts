const VALID_ROLES = ['ADMIN_ROLE', 'USER_ROLE', 'WAREHOUSE_ROLE'];

export class RegisterUserDto {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly roles: string[],
  ) { }

  static create(body: Record<string, unknown>): [string?, RegisterUserDto?] {
    const { name, email, password, roles = ['USER_ROLE'] } = body;

    if (!name || typeof name !== 'string') return ['Name is required'];
    if (name.trim().length < 2) return ['Name must be at least 2 characters'];
    if (!email || typeof email !== 'string') return ['Email is required'];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ['Invalid email format'];
    if (!password || typeof password !== 'string') return ['Password is required'];
    if (password.length < 6) return ['Password must be at least 6 characters'];
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) return ['Password must contain letters and numbers'];

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    if (!rolesArray.every((r) => VALID_ROLES.includes(r as string)))
      return [`Invalid role. Valid roles: ${VALID_ROLES.join(', ')}`];

    return [undefined, new RegisterUserDto(name.trim(), email.toLowerCase().trim(), password, rolesArray as string[])];
  }
}
