export class CreateSupplierDto {
  private constructor(
    public readonly name: string,
    public readonly contactName?: string,
    public readonly phone?: string,
    public readonly email?: string,
    public readonly address?: string,
  ) { }

  static create(body: Record<string, unknown>): [string?, CreateSupplierDto?] {
    const { name, contactName, phone, email, address } = body;

    if (!name || typeof name !== 'string') return ['Supplier name is required'];
    if (name.trim().length < 2) return ['Name must be at least 2 characters'];
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string)) return ['Invalid email format'];

    return [
      undefined,
      new CreateSupplierDto(
        (name as string).trim(),
        contactName ? (contactName as string).trim() : undefined,
        phone ? (phone as string).trim() : undefined,
        email ? (email as string).toLowerCase().trim() : undefined,
        address ? (address as string).trim() : undefined,
      ),
    ];
  }
}

export class UpdateSupplierDto {
  private constructor(
    public readonly name?: string,
    public readonly contactName?: string,
    public readonly phone?: string,
    public readonly email?: string,
    public readonly address?: string,
  ) { }

  static create(body: Record<string, unknown>): [string?, UpdateSupplierDto?] {
    const { name, contactName, phone, email, address } = body;

    if (!name && !contactName && !phone && !email && !address) return ['At least one field is required'];
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string)) return ['Invalid email format'];

    return [
      undefined,
      new UpdateSupplierDto(
        name ? (name as string).trim() : undefined,
        contactName ? (contactName as string).trim() : undefined,
        phone ? (phone as string).trim() : undefined,
        email ? (email as string).toLowerCase().trim() : undefined,
        address ? (address as string).trim() : undefined,
      ),
    ];
  }
}
