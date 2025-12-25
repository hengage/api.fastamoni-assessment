import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { ResponseMessage } from 'src/common/decorators/response.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login successful')
  login(@Request() req: { user: User }, @Body() _: LoginDto) {
    return this.authService.login(req.user);
  }
}
