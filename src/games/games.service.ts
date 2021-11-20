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

  // get all games
  async getAllGames(): Promise<Game[]> {
    return await this.gameService.find();
  }

  // create game
  async createGameUserAdmin(
    createGameDto: CreateGameDto,
    userId: User,
  ): Promise<Game> {
    const game = await this.gameService.createGame(createGameDto, userId);
    return game;
  }

  // get by game name
  async findByNameGame(name: string): Promise<Game> {
    const nameGame = await this.gameService.findOne({ where: { name } });
    return nameGame;
  }

  // get by id game
  async findGameById(gameId: string): Promise<Game> {
    const game = await this.gameService.findOne(gameId, {
      select: ['name', 'image', 'bio', 'releaseDate', 'likes', 'categories'],
    });

    if (!game) throw new NotFoundException('Jogo não encontrado');

    return game;
  }

  // update game
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
        'Erro ao atualizar os dados no banco de dados',
      );
    }
  }

  // delete game
  async deleteUser(gameId: string) {
    const result = await this.gameService.delete({ id: gameId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um jogo com o ID informado',
      );
    }
  }
}
