export class SupplierEntity {
  constructor(
    public id: number,
    public name: string,
    public contactName: string | null,
    public phone: string | null,
    public email: string | null,
    public address: string | null,
    public isActive: boolean,
    public createdAt: Date,
  ) { }
}
