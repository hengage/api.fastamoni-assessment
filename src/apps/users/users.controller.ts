import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({ type: () => ApiResponseDto<User> })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
