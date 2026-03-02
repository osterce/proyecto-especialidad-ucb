export class UpdateUserDto {
  private constructor(
    public readonly name?: string,
    public readonly email?: string,
  ) { }

  static create(body: Record<string, unknown>): [string?, UpdateUserDto?] {
    const { name, email } = body;

    if (!name && !email) return ['At least one field (name or email) is required'];
    if (name !== undefined && typeof name !== 'string') return ['Name must be a string'];
    if (name && name.trim().length < 2) return ['Name must be at least 2 characters'];
    if (email !== undefined && typeof email !== 'string') return ['Email must be a string'];
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ['Invalid email format'];

    return [
      undefined,
      new UpdateUserDto(
        name ? (name as string).trim() : undefined,
        email ? (email as string).toLowerCase().trim() : undefined,
      ),
    ];
  }
}
