import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { UserEntity } from '../../entities/user.entity';
import { AuthRepository } from '../../repositories/auth.repository';
import { CustomError } from '../../errors/custom.error';
import { JwtAdapter } from '../../../config/jwt.adapter';
import { BcryptAdapter } from '../../../config/bcrypt.adapter';

interface RegisterResponse {
  token: string;
  user: Omit<UserEntity, 'passwordHash'>;
}

export class RegisterUser {
  constructor(private readonly authRepository: AuthRepository) { }

  async execute(registerUserDto: RegisterUserDto): Promise<RegisterResponse> {
    // Hash password before storing
    const hashedPassword = BcryptAdapter.hash(registerUserDto.password);
    const dtoWithHash = { ...registerUserDto, password: hashedPassword };

    const user = await this.authRepository.register(dtoWithHash as RegisterUserDto);
    const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
    if (!token) throw CustomError.internalServer('Error generating token');

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}
