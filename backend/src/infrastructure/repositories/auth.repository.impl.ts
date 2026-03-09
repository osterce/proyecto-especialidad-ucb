import { AuthDataSource } from '../../domain/datasources/auth.datasource';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UpdateUserDto } from '../../domain/dtos/auth/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authDataSource: AuthDataSource) { }
  register(dto: RegisterUserDto): Promise<UserEntity> { return this.authDataSource.register(dto); }
  login(dto: LoginUserDto): Promise<UserEntity> { return this.authDataSource.login(dto); }
  getUsers(): Promise<UserEntity[]> { return this.authDataSource.getUsers(); }
  getUserById(id: number): Promise<UserEntity> { return this.authDataSource.getUserById(id); }
  updateUser(id: number, dto: UpdateUserDto): Promise<UserEntity> { return this.authDataSource.updateUser(id, dto); }
  deactivateUser(id: number): Promise<UserEntity> { return this.authDataSource.deactivateUser(id); }
  activateUser(id: number): Promise<UserEntity> { return this.authDataSource.activateUser(id); }
  resetPassword(id: number): Promise<void> { return this.authDataSource.resetPassword(id); }
  activateWithPassword(email: string, currentPassword: string, newPassword: string): Promise<UserEntity> { return this.authDataSource.activateWithPassword(email, currentPassword, newPassword); }
  updateRoles(id: number, roles: string[]): Promise<UserEntity> { return this.authDataSource.updateRoles(id, roles); }
}
