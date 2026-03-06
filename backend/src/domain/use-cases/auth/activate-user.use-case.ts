import { AuthRepository } from '../../repositories/auth.repository';
import { UserEntity } from '../../entities/user.entity';

export class ActivateUser {
  constructor(private readonly authRepository: AuthRepository) { }

  async execute(id: number): Promise<UserEntity> {
    const user = await this.authRepository.activateUser(id);
    return user;
  }
}
