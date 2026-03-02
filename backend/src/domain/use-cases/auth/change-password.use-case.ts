import { ChangePasswordDto } from '../../dtos/auth/change-password.dto';
import { AuthRepository } from '../../repositories/auth.repository';

export class ChangePassword {
  constructor(private readonly authRepository: AuthRepository) { }

  async execute(userId: number, dto: ChangePasswordDto): Promise<{ message: string }> {
    await this.authRepository.changePassword(userId, dto.currentPassword, dto.newPassword);
    return { message: 'Password changed successfully' };
  }
}
