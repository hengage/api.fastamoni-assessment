import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ValidateRequestGuard } from 'src/common/guards/validate-request.guard';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(new ValidateRequestGuard(LoginDto), LocalAuthGuard)
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'User logged in successfully',
  })
  @ResponseMessage('Login successful')
  login(@Body() _: LoginDto, @Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
