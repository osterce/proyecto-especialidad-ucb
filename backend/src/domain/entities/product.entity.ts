export class ProductEntity {
  constructor(
    public id: number,
    public name: string,
    public sku: string,
    public description: string | null,
    public categoryId: number | null,
    public categoryName: string | null,
    public unitPrice: number,
    public minStock: number,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) { }
}
