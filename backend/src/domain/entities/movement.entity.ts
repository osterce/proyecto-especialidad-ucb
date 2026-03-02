export class MovementEntity {
  constructor(
    public id: number,
    public productId: number,
    public productName: string,
    public warehouseId: number,
    public warehouseName: string,
    public supplierId: number | null,
    public supplierName: string | null,
    public type: 'ENTRADA' | 'SALIDA',
    public quantity: number,
    public unitPrice: number,
    public totalPrice: number,
    public reference: string | null,
    public notes: string | null,
    public createdBy: number | null,
    public createdByName: string | null,
    public createdAt: Date,
  ) { }
}
