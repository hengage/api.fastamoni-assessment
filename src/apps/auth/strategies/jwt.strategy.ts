import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/apps/users/users.service';
import { Msgs } from 'src/common/utils/messages.utils';
import { EnvironmentKeys } from 'src/config/config.service';
import { ENV } from 'src/config/env';
import { IJwtPayload } from '../interface/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENV.JWT_SECRET as EnvironmentKeys,
    });
  }

  async validate(payload: IJwtPayload) {
    try {
      return await this.usersService.findById(payload.sub);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(Msgs.auth.UNAUTHORIZED());
      }
      throw error;
    }
  }
}
