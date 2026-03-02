import { AuthRepository } from '../../repositories/auth.repository';
import { UserEntity } from '../../entities/user.entity';

export class GetUsers {
  constructor(private readonly authRepository: AuthRepository) { }

  async execute(): Promise<Omit<UserEntity, 'passwordHash'>[]> {
    const users = await this.authRepository.getUsers();
    return users.map(({ passwordHash: _, ...u }) => u);
  }
}
