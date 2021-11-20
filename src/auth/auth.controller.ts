import { Controller, ValidationPipe, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserCredentialsDto } from './dtos/user-credentials.dto';
import { UseGuards } from '@nestjs/common';
import { User } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './auth-decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/create-account')
  async createAccount(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.createAccount(createUserDto);
    return { message: 'Usuário cadastrado com sucesso.' };
  }

  @Post('/login')
  async signIn(
    @Body(ValidationPipe) userCredentialsDto: UserCredentialsDto,
  ): Promise<{ token: string }> {
    return await this.authService.loginUser(userCredentialsDto);
  }

  @Get('/myself')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
