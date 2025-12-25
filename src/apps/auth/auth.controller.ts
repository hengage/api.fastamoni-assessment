import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ValidateRequestGuard } from 'src/common/guards/validate-request.guard';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(new ValidateRequestGuard(LoginDto), LocalAuthGuard)
  @ResponseMessage('Login successful')
  login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
