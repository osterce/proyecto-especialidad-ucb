import { UserEntity } from '../../domain/entities/user.entity';

export class UserMapper {
  static fromRow(row: Record<string, unknown>, roles: string[] = []): UserEntity {
    return new UserEntity(
      row.id as number,
      row.name as string,
      row.email as string,
      row.password_hash as string,
      roles,
      row.is_active as boolean,
      row.created_at as Date,
    );
  }

  static fromRowWithRoles(row: Record<string, unknown>): UserEntity {
    const roles = Array.isArray(row.roles) ? (row.roles as string[]).filter(Boolean) : [];
    return new UserEntity(
      row.id as number,
      row.name as string,
      row.email as string,
      row.password_hash as string,
      roles,
      row.is_active as boolean,
      row.created_at as Date,
    );
  }
}
