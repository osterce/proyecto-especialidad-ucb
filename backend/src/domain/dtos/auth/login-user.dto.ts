export class LoginUserDto {
  private constructor(
    public readonly email: string,
    public readonly password: string,
  ) { }

  static create(body: Record<string, unknown>): [string?, LoginUserDto?] {
    const { email, password } = body;

    if (!email || typeof email !== 'string') return ['Email is required'];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ['Invalid email format'];
    if (!password || typeof password !== 'string') return ['Password is required'];

    return [undefined, new LoginUserDto(email.toLowerCase().trim(), password)];
  }
}
