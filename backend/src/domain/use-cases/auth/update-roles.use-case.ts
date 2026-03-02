import { UpdateRolesDto } from '../../dtos/auth/update-roles.dto';
import { AuthRepository } from '../../repositories/auth.repository';
import { UserEntity } from '../../entities/user.entity';

export class UpdateRoles {
  constructor(private readonly authRepository: AuthRepository) { }

  async execute(userId: number, dto: UpdateRolesDto): Promise<Omit<UserEntity, 'passwordHash'>> {
    const user = await this.authRepository.updateRoles(userId, dto.roles);
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
