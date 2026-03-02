export class CreateMovementDto {
  private constructor(
    public readonly productId: number,
    public readonly warehouseId: number,
    public readonly type: 'ENTRADA' | 'SALIDA',
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly supplierId: number | undefined,
    public readonly reference: string | undefined,
    public readonly notes: string | undefined,
  ) { }

  static createEntrada(body: Record<string, unknown>): [string?, CreateMovementDto?] {
    return CreateMovementDto.create(body, 'ENTRADA');
  }

  static createSalida(body: Record<string, unknown>): [string?, CreateMovementDto?] {
    return CreateMovementDto.create(body, 'SALIDA');
  }

  private static create(body: Record<string, unknown>, type: 'ENTRADA' | 'SALIDA'): [string?, CreateMovementDto?] {
    const { productId, warehouseId, quantity, unitPrice, supplierId, reference, notes } = body;

    if (!productId || typeof productId !== 'number' || productId < 1) return ['Valid product ID is required'];
    if (!warehouseId || typeof warehouseId !== 'number' || warehouseId < 1) return ['Valid warehouse ID is required'];
    if (!quantity || typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity))
      return ['Quantity must be a positive integer'];
    if (unitPrice === undefined || typeof unitPrice !== 'number' || unitPrice < 0)
      return ['Unit price must be a non-negative number'];
    if (type === 'ENTRADA' && supplierId !== undefined && (typeof supplierId !== 'number' || supplierId < 1))
      return ['Valid supplier ID is required'];

    return [
      undefined,
      new CreateMovementDto(
        Number(productId),
        Number(warehouseId),
        type,
        Number(quantity),
        Number(unitPrice),
        supplierId ? Number(supplierId) : undefined,
        reference ? (reference as string).trim() : undefined,
        notes ? (notes as string).trim() : undefined,
      ),
    ];
  }
}
