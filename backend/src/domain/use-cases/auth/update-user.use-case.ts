import { UpdateUserDto } from '../../dtos/auth/update-user.dto';
import { AuthRepository } from '../../repositories/auth.repository';
import { UserEntity } from '../../entities/user.entity';

export class UpdateUser {
  constructor(private readonly authRepository: AuthRepository) { }

  async execute(id: number, dto: UpdateUserDto): Promise<Omit<UserEntity, 'passwordHash'>> {
    const user = await this.authRepository.updateUser(id, dto);
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
