export class WarehouseEntity {
  constructor(
    public id: number,
    public name: string,
    public location: string | null,
    public description: string | null,
    public isActive: boolean,
    public createdAt: Date,
  ) { }
}
