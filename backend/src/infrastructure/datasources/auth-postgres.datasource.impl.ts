import { Pool } from 'pg';
import { AuthDataSource } from '../../domain/datasources/auth.datasource';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UpdateUserDto } from '../../domain/dtos/auth/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { UserMapper } from '../mappers/user.mapper';
import { BcryptAdapter } from '../../config/bcrypt.adapter';

export class AuthPostgresDataSourceImpl implements AuthDataSource {
  constructor(private readonly pool: Pool) { }

  async register(dto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password, roles } = dto;

    // Check email uniqueness
    const existing = await this.pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) throw CustomError.conflict('Email already registered');

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Insert user
      const userResult = await client.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password],
      );
      const user = userResult.rows[0];

      // Assign roles
      for (const roleName of roles) {
        const roleResult = await client.query('SELECT id FROM roles WHERE name = $1', [roleName]);
        if (roleResult.rows.length === 0) throw CustomError.badRequest(`Role ${roleName} not found`);
        await client.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [user.id, roleResult.rows[0].id]);
      }

      await client.query('COMMIT');

      return UserMapper.fromRow(user, roles);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async login(dto: LoginUserDto): Promise<UserEntity> {
    const result = await this.pool.query(
      `SELECT u.*, ARRAY_AGG(r.name) FILTER (WHERE r.name IS NOT NULL) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.email = $1 AND u.is_active = true
       GROUP BY u.id`,
      [dto.email],
    );

    if (result.rows.length === 0) throw CustomError.unauthorized('Invalid credentials');

    return UserMapper.fromRowWithRoles(result.rows[0]);
  }

  async getUsers(): Promise<UserEntity[]> {
    const result = await this.pool.query(
      `SELECT u.*, ARRAY_AGG(r.name) FILTER (WHERE r.name IS NOT NULL) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       GROUP BY u.id
       ORDER BY u.created_at DESC`,
    );
    return result.rows.map(UserMapper.fromRowWithRoles);
  }

  async getUserById(id: number): Promise<UserEntity> {
    const result = await this.pool.query(
      `SELECT u.*, ARRAY_AGG(r.name) FILTER (WHERE r.name IS NOT NULL) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [id],
    );
    if (result.rows.length === 0) throw CustomError.notFound('User not found');
    return UserMapper.fromRowWithRoles(result.rows[0]);
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    await this.getUserById(id); // ensure exists

    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.name) { fields.push(`name = $${idx++}`); values.push(dto.name); }
    if (dto.email) {
      const existing = await this.pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [dto.email, id]);
      if (existing.rows.length > 0) throw CustomError.conflict('Email already in use');
      fields.push(`email = $${idx++}`); values.push(dto.email);
    }

    values.push(id);
    await this.pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}`, values);
    return this.getUserById(id);
  }

  async deactivateUser(id: number): Promise<UserEntity> {
    const result = await this.pool.query(
      'UPDATE users SET is_active = false WHERE id = $1 RETURNING id',
      [id],
    );
    if (result.rows.length === 0) throw CustomError.notFound('User not found');
    return this.getUserById(id);
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    const result = await this.pool.query('SELECT password_hash FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) throw CustomError.notFound('User not found');

    const isValid = BcryptAdapter.compare(currentPassword, result.rows[0].password_hash);
    if (!isValid) throw CustomError.unauthorized('Current password is incorrect');

    const newHash = BcryptAdapter.hash(newPassword);
    await this.pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, id]);
  }

  async updateRoles(id: number, roles: string[]): Promise<UserEntity> {
    await this.getUserById(id);
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM user_roles WHERE user_id = $1', [id]);
      for (const roleName of roles) {
        const roleResult = await client.query('SELECT id FROM roles WHERE name = $1', [roleName]);
        if (roleResult.rows.length === 0) throw CustomError.badRequest(`Role ${roleName} not found`);
        await client.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [id, roleResult.rows[0].id]);
      }
      await client.query('COMMIT');
      return this.getUserById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
