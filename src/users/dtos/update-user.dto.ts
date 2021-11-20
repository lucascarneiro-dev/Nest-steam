import { UserRole } from '../user-roles.enum';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: 'User name is missing.',
  })
  username: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'E-mail not valid.',
    },
  )
  email: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  status: boolean;

  @IsOptional()
  games: string[];
}
