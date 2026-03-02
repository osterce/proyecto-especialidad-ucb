import { AuthRepository } from '../../repositories/auth.repository';
import { UserEntity } from '../../entities/user.entity';

export class DeactivateUser {
  constructor(private readonly authRepository: AuthRepository) { }

  async execute(id: number): Promise<Omit<UserEntity, 'passwordHash'>> {
    const user = await this.authRepository.deactivateUser(id);
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
