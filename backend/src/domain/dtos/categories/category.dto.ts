export class CreateCategoryDto {
  private constructor(
    public readonly name: string,
    public readonly description?: string,
  ) { }

  static create(body: Record<string, unknown>): [string?, CreateCategoryDto?] {
    const { name, description } = body;

    if (!name || typeof name !== 'string') return ['Category name is required'];
    if (name.trim().length < 2) return ['Name must be at least 2 characters'];

    return [
      undefined,
      new CreateCategoryDto(
        (name as string).trim(),
        description ? (description as string).trim() : undefined,
      ),
    ];
  }
}

export class UpdateCategoryDto {
  private constructor(
    public readonly name?: string,
    public readonly description?: string,
  ) { }

  static create(body: Record<string, unknown>): [string?, UpdateCategoryDto?] {
    const { name, description } = body;

    if (!name && !description) return ['At least one field is required'];

    return [
      undefined,
      new UpdateCategoryDto(
        name ? (name as string).trim() : undefined,
        description ? (description as string).trim() : undefined,
      ),
    ];
  }
}
