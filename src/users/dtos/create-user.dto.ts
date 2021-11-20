import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Game } from 'src/games/game.entity';

export class CreateUserDto {
  @IsOptional()
  id: number;

  @IsNotEmpty({
    message: 'E-mail is missing.',
  })
  @IsEmail({}, { message: 'E-mail not valid.' })
  email: string;

  @IsNotEmpty({ message: 'Username is missing.' })
  @MaxLength(200, { message: 'Name must have less than 200 characters.' })
  username: string;

  @IsNotEmpty({ message: 'Password is missing.' })
  @MinLength(8, { message: 'Pasword must have at least 8 characters' })
  password: string;

  @IsOptional()
  games: Game[];
}
