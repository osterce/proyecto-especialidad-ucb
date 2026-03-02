export class InventoryEntity {
  constructor(
    public id: number,
    public productId: number,
    public productName: string,
    public productSku: string,
    public warehouseId: number,
    public warehouseName: string,
    public stockQuantity: number,
    public minStock: number,
    public lastUpdated: Date,
  ) { }
}
