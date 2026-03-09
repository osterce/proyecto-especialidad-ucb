import { ActivateWithPasswordDto } from '../../dtos/auth/activate-with-password.dto';
import { AuthRepository } from '../../repositories/auth.repository';
import { UserEntity } from '../../entities/user.entity';

export class ActivateWithPassword {
  constructor(private readonly authRepository: AuthRepository) { }

  async execute(dto: ActivateWithPasswordDto): Promise<UserEntity> {
    const user = await this.authRepository.activateWithPassword(dto.email, dto.currentPassword, dto.newPassword);
    return user;
  }
}
