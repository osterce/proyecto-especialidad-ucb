import * as bcrypt from 'bcryptjs';

export class BcryptAdapter {
  static hash(password: string, rounds = 10): string {
    return bcrypt.hashSync(password, rounds);
  }

  static compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
