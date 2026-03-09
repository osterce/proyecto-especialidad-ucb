import { AuthRepository } from '../../repositories/auth.repository';

export class ResetPassword {
  constructor(private readonly authRepository: AuthRepository) { }

  async execute(userId: number): Promise<{ message: string }> {
    await this.authRepository.resetPassword(userId);
    return { message: 'Password reset successfully. User is now inactive.' };
  }
}
