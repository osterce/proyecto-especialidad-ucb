import * as jwt from 'jsonwebtoken';
import { envs } from './envs';

interface JwtPayload {
  id: number;
  email: string;
}

export class JwtAdapter {
  static async generateToken(payload: JwtPayload): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign(payload, envs.JWT_SEED, { expiresIn: envs.JWT_EXPIRE as jwt.SignOptions['expiresIn'] }, (err, token) => {
        if (err) return resolve(null);
        resolve(token as string);
      });
    });
  }

  static validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, envs.JWT_SEED, (err, decoded) => {
        if (err) return resolve(null);
        resolve(decoded as T);
      });
    });
  }
}
