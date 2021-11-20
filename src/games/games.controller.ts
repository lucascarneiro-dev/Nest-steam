import {
  Post,
  Body,
  ValidationPipe,
  Controller,
  Get,
  Param,
  NotFoundException,
  Delete,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { CreateGameDto } from './dtos/create.game.dto';
import { ReturnGameDto } from './dtos/return-game.dto';
import { UserRole } from 'src/users/user-roles.enum';
import { UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/auth-role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/auth-roles.guard';
import { GamesService } from './games.service';
import { UsersService } from 'src/users/users.service';
import { GetUser } from 'src/auth/auth-decorator';
import { UpdateGameDto } from './dtos/update-game.dto';
import { User } from 'src/users/user.entity';

@Controller('game')
export class GamesController {
  constructor(
    private userService: UsersService,
    private gameService: GamesService,
  ) {}

  @Get()
  async findAllGames() {
    return this.gameService.getAllGames();
  }

  @Get(':name')
  async getByNameGame(@Param('name') name: string): Promise<ReturnGameDto> {
    const game = await this.gameService.findByNameGame(name);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return {
      game,
      message: 'Game found.',
    };
  }

  @Post('create-game')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.ADMIN)
  async createGame(
    @Body(ValidationPipe) createGameDto: CreateGameDto,
  ): Promise<ReturnGameDto> {
    const userId = await this.userService.findUserById(createGameDto.user);

    const game = await this.gameService.createGameUserAdmin(
      createGameDto,
      userId,
    );
    console.log(userId);
    return {
      game,
      message: 'Game sucessfully posted.',
    };
  }

  @Patch('/:id')
  async updateGame(
    @Body(ValidationPipe) updateGameDto: UpdateGameDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    if (user.role != UserRole.ADMIN)
      throw new ForbiddenException(
        'You are not allowed.',
      );
    else {
      return this.gameService.updateGame(updateGameDto, id);
    }
  }

  // get game by id
  @Get('/:id')
  @Role(UserRole.ADMIN)
  async findGameById(@Param('id') id: string): Promise<ReturnGameDto> {
    const game = await this.gameService.findGameById(id);
    return {
      game,
      message: 'Game found',
    };
  }

  @Delete('/:id')
  @Role(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.gameService.deleteUser(id);
    return { message: 'Game deleted.' };
  }
}
