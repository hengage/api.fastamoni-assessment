import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 10;

  static hash(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordUtil.SALT_ROUNDS) as Promise<string>;
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return (await bcrypt.compare(password, hash)) as boolean;
  }
}
