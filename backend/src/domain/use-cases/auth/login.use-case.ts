import { LoginUserDto } from '../../dtos/auth/login-user.dto';
import { AuthRepository } from '../../repositories/auth.repository';
import { CustomError } from '../../errors/custom.error';
import { JwtAdapter } from '../../../config/jwt.adapter';
import { BcryptAdapter } from '../../../config/bcrypt.adapter';
import { UserEntity } from '../../entities/user.entity';

interface LoginResponse {
  token: string;
  user: Omit<UserEntity, 'passwordHash'>;
}

export class LoginUser {
  constructor(private readonly authRepository: AuthRepository) { }

  async execute(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.authRepository.login(loginUserDto);

    const isPasswordValid = BcryptAdapter.compare(loginUserDto.password, user.passwordHash);
    if (!isPasswordValid) throw CustomError.unauthorized('Invalid credentials');

    const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
    if (!token) throw CustomError.internalServer('Error generating token');

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}
