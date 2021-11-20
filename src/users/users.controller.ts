import {
  Controller,
  Body,
  Post,
  ValidationPipe,
  Get,
  Param,
  Patch,
  NotFoundException,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { ReturnUserDto } from './dtos/return-user';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/auth-role.decorator';
import { UserRole } from './user-roles.enum';
import { RolesGuard } from 'src/auth/auth-roles.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUser } from 'src/auth/auth-decorator';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrador criado com sucesso',
    };
  }

  // get all users
  @Get()
  async getAll() {
    return this.usersService.getAllUsers();
  }

  // get name user
  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return {
      user,
      message: 'Usuário encontrado',
    };
  }

  // get by id user
  @Get(':id')
  async getByIdUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.findUserById(id);
    return {
      user,
      message: 'Usuário encontrado.',
    };
  }

  @Patch(':id')
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const idUser = parseInt(user.id);

    if (user.role != UserRole.ADMIN && idUser !== id) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );
    } else {
      return this.usersService.updateUser(updateUserDto, id);
    }
  }

  // add game

  @UseGuards(AuthGuard(), RolesGuard)
  @Patch(':id')
  async addGame(
    @Body(ValidationPipe) updateUser: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() userMe: User,
  ) {
    const user = this.usersService.addGameUser(updateUser, id, userMe.id);
    return {
      user,
      message: 'sei',
    };
  }
}
