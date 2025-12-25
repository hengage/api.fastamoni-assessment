import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: User['email'],
    password: User['password'],
  ): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    const isValid = await user.comparePassword(password);
    return isValid ? user : null;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
