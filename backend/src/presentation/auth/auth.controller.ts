import { Request, Response } from 'express';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { UpdateUserDto } from '../../domain/dtos/auth/update-user.dto';
import { ChangePasswordDto } from '../../domain/dtos/auth/change-password.dto';
import { UpdateRolesDto } from '../../domain/dtos/auth/update-roles.dto';
import { CustomError } from '../../domain/errors/custom.error';
import { RegisterUser } from '../../domain/use-cases/auth/register.use-case';
import { LoginUser as LoginUseCase } from '../../domain/use-cases/auth/login.use-case';
import { GetUsers as GetUsersUseCase } from '../../domain/use-cases/auth/get-users.use-case';
import { UpdateUser as UpdateUserUseCase } from '../../domain/use-cases/auth/update-user.use-case';
import { DeactivateUser as DeactivateUserUseCase } from '../../domain/use-cases/auth/deactivate-user.use-case';
import { ActivateUser as ActivateUserUseCase } from '../../domain/use-cases/auth/activate-user.use-case';
import { ChangePassword as ChangePasswordUseCase } from '../../domain/use-cases/auth/change-password.use-case';
import { UpdateRoles as UpdateRolesUseCase } from '../../domain/use-cases/auth/update-roles.use-case';

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) { }

  private handleError = (error: unknown, res: Response): void => {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    console.error(error);
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  };

  registerUser = (req: Request, res: Response): void => {
    const [error, dto] = RegisterUserDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }

    new RegisterUser(this.authRepository)
      .execute(dto!)
      .then((data) => res.status(201).json(data))
      .catch((err) => this.handleError(err, res));
  };

  loginUser = (req: Request, res: Response): void => {
    const [error, dto] = LoginUserDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }

    new LoginUseCase(this.authRepository)
      .execute(dto!)
      .then((data) => res.json(data))
      .catch((err) => this.handleError(err, res));
  };

  getUsers = (_req: Request, res: Response): void => {
    new GetUsersUseCase(this.authRepository)
      .execute()
      .then((data) => res.json(data))
      .catch((err) => this.handleError(err, res));
  };

  updateUser = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

    const [error, dto] = UpdateUserDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }

    new UpdateUserUseCase(this.authRepository)
      .execute(id, dto!)
      .then((data) => res.json(data))
      .catch((err) => this.handleError(err, res));
  };

  deactivateUser = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

    new DeactivateUserUseCase(this.authRepository)
      .execute(id)
      .then((data) => res.json({ message: 'User deactivated' }))
      .catch((err) => this.handleError(err, res));
  };

  activateUser = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

    new ActivateUserUseCase(this.authRepository)
      .execute(id)
      .then((data) => res.json({ message: 'User activated' }))
      .catch((err) => this.handleError(err, res));
  };


  changePassword = (req: Request, res: Response): void => {
    const userId = (req.body.user as { id: number }).id;
    const [error, dto] = ChangePasswordDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }

    new ChangePasswordUseCase(this.authRepository)
      .execute(userId, dto!)
      .then((data) => res.json(data))
      .catch((err) => this.handleError(err, res));
  };

  updateRoles = (req: Request, res: Response): void => {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

    const [error, dto] = UpdateRolesDto.create(req.body as Record<string, unknown>);
    if (error) { res.status(400).json({ error }); return; }

    new UpdateRolesUseCase(this.authRepository)
      .execute(id, dto!)
      .then((data) => res.json(data))
      .catch((err) => this.handleError(err, res));
  };
}
