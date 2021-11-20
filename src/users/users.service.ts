import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/users/user.entity';
import { UserRole } from './user-roles.enum';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GameRepository } from 'src/games/game.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userService: UserRepository,
    private gameRepository: GameRepository,
  ) {}

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto, UserRole.ADMIN);
    }

  async updateUser(updateUserDto: UpdateUserDto, id: number): Promise<User> {
    const user = await this.findUserById(id);
    const { username, email, role, status } = updateUserDto;

    user.username = username ? username : user.username;
    user.email = email ? email : user.email;
    user.role = role ? role : user.role;
    user.status = status === undefined ? user.status : status;

    try {
      await user.save();
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error',
      );
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userService.find();
  }

  async findUserById(userId: number): Promise<User> {
    const user = await this.userService.findOne(userId, {
      select: ['email', 'username', 'role', 'id'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const userExist = await this.userService.findOne({ where: { username } });

    if (!userExist) {
      throw new NotFoundException('Jogo não existe.');
    }

    return userExist;
  }

  async addGameUser(
    userUpate: UpdateUserDto,
    id: number,
    userMe: string,
  ): Promise<User> {
    const user = await this.userService.findOne(userMe);
    const { username, email, role, status } = userUpate;
    const idGame = await this.gameRepository.findOne({ where: { id: id } });

    user.username = username ? username : user.username;
    user.email = email ? email : user.email;
    user.role = role ? role : user.role;
    user.status = status === undefined ? user.status : status;
    user.gameFollow = [idGame.name];

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error',
      );
    }
    return user;
  }
}
