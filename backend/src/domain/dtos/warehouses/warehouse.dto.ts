export class CreateWarehouseDto {
  private constructor(
    public readonly name: string,
    public readonly location?: string,
    public readonly description?: string,
  ) { }

  static create(body: Record<string, unknown>): [string?, CreateWarehouseDto?] {
    const { name, location, description } = body;

    if (!name || typeof name !== 'string') return ['Warehouse name is required'];
    if (name.trim().length < 2) return ['Name must be at least 2 characters'];

    return [
      undefined,
      new CreateWarehouseDto(
        (name as string).trim(),
        location ? (location as string).trim() : undefined,
        description ? (description as string).trim() : undefined,
      ),
    ];
  }
}

export class UpdateWarehouseDto {
  private constructor(
    public readonly name?: string,
    public readonly location?: string,
    public readonly description?: string,
  ) { }

  static create(body: Record<string, unknown>): [string?, UpdateWarehouseDto?] {
    const { name, location, description } = body;

    if (!name && !location && !description) return ['At least one field is required'];

    return [
      undefined,
      new UpdateWarehouseDto(
        name ? (name as string).trim() : undefined,
        location ? (location as string).trim() : undefined,
        description ? (description as string).trim() : undefined,
      ),
    ];
  }
}
