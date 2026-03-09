import { LoginUserDto } from '../dtos/auth/login-user.dto';
import { RegisterUserDto } from '../dtos/auth/register-user.dto';
import { UpdateUserDto } from '../dtos/auth/update-user.dto';
import { UserEntity } from '../entities/user.entity';

export abstract class AuthRepository {
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
  abstract getUsers(): Promise<UserEntity[]>;
  abstract getUserById(id: number): Promise<UserEntity>;
  abstract updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity>;
  abstract deactivateUser(id: number): Promise<UserEntity>;
  abstract activateUser(id: number): Promise<UserEntity>;
  abstract resetPassword(id: number): Promise<void>;
  abstract activateWithPassword(email: string, currentPassword: string, newPassword: string): Promise<UserEntity>;
  abstract updateRoles(id: number, roles: string[]): Promise<UserEntity>;
}
