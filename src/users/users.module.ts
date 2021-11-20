import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { GameRepository } from 'src/games/game.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, GameRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
