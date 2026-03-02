export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly sku: string,
    public readonly description: string | undefined,
    public readonly categoryId: number | undefined,
    public readonly unitPrice: number,
    public readonly minStock: number,
  ) { }

  static create(body: Record<string, unknown>): [string?, CreateProductDto?] {
    const { name, sku, description, categoryId, unitPrice, minStock = 0 } = body;

    if (!name || typeof name !== 'string') return ['Product name is required'];
    if (name.trim().length < 2) return ['Name must be at least 2 characters'];
    if (!sku || typeof sku !== 'string') return ['SKU is required'];
    if (sku.trim().length < 2) return ['SKU must be at least 2 characters'];
    if (unitPrice === undefined || unitPrice === null) return ['Unit price is required'];
    if (typeof unitPrice !== 'number' || unitPrice < 0) return ['Unit price must be a non-negative number'];
    if (typeof minStock !== 'number' || minStock < 0) return ['Min stock must be a non-negative integer'];
    if (categoryId !== undefined && categoryId !== null && (typeof categoryId !== 'number' || categoryId < 1))
      return ['Category ID must be a positive integer'];

    return [
      undefined,
      new CreateProductDto(
        (name as string).trim(),
        (sku as string).trim().toUpperCase(),
        description ? (description as string).trim() : undefined,
        categoryId ? Number(categoryId) : undefined,
        Number(unitPrice),
        Number(minStock),
      ),
    ];
  }
}

export class UpdateProductDto {
  private constructor(
    public readonly name?: string,
    public readonly sku?: string,
    public readonly description?: string,
    public readonly categoryId?: number,
    public readonly unitPrice?: number,
    public readonly minStock?: number,
  ) { }

  static create(body: Record<string, unknown>): [string?, UpdateProductDto?] {
    const { name, sku, description, categoryId, unitPrice, minStock } = body;

    if (!name && !sku && description === undefined && categoryId === undefined && unitPrice === undefined && minStock === undefined)
      return ['At least one field is required'];
    if (unitPrice !== undefined && (typeof unitPrice !== 'number' || unitPrice < 0))
      return ['Unit price must be a non-negative number'];
    if (minStock !== undefined && (typeof minStock !== 'number' || minStock < 0))
      return ['Min stock must be a non-negative integer'];

    return [
      undefined,
      new UpdateProductDto(
        name ? (name as string).trim() : undefined,
        sku ? (sku as string).trim().toUpperCase() : undefined,
        description ? (description as string).trim() : undefined,
        categoryId ? Number(categoryId) : undefined,
        unitPrice !== undefined ? Number(unitPrice) : undefined,
        minStock !== undefined ? Number(minStock) : undefined,
      ),
    ];
  }
}
