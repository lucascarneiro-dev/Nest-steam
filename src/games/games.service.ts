import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { CreateGameDto } from './dtos/create.game.dto';
import { Game } from './game.entity';
import { User } from 'src/users/user.entity';
import { UpdateGameDto } from './dtos/update-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameRepository)
    private gameService: GameRepository,
  ) {}

  async getAllGames(): Promise<Game[]> {
    return await this.gameService.find();
  }

  async createGameUserAdmin(
    createGameDto: CreateGameDto,
    userId: User,
  ): Promise<Game> {
    const game = await this.gameService.createGame(createGameDto, userId);
    return game;
  }

  async findByNameGame(name: string): Promise<Game> {
    const nameGame = await this.gameService.findOne({ where: { name } });
    return nameGame;
  }

  async findGameById(gameId: string): Promise<Game> {
    const game = await this.gameService.findOne(gameId, {
      select: ['name', 'image', 'bio', 'releaseDate', 'likes', 'categories'],
    });

    if (!game) throw new NotFoundException('Game not found');

    return game;
  }

  async updateGame(updateGameDto: UpdateGameDto, id: string): Promise<Game> {
    const game = await this.findGameById(id);
    const { name, image, bio, releaseDate, likes } = updateGameDto;

    game.name = name ? name : name;
    game.image = image ? image : game.image;
    game.bio = bio ? bio : game.bio;
    game.releaseDate = releaseDate ? releaseDate : game.releaseDate;
    game.likes = likes ? likes : game.likes;
    try {
      await game.save();
      return game;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error',
      );
    }
  }

  // delete game
  async deleteUser(gameId: string) {
    const result = await this.gameService.delete({ id: gameId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Game not found.',
      );
    }
  }
}
