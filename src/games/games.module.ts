import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { UserRepository } from 'src/users/users.repository';
import { GameRepository } from './game.repository';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameRepository, UserRepository]),
    AuthModule,
    UsersModule,
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
