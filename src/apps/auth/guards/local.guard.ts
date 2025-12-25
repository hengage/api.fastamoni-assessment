import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGIES } from 'src/common/constants';

@Injectable()
export class LocalAuthGuard extends AuthGuard(AUTH_STRATEGIES.LOCAL) {}
