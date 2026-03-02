export class UserEntity {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public passwordHash: string,
    public roles: string[],
    public isActive: boolean,
    public createdAt: Date,
  ) { }
}
