import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './user-roles.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserCredentialsDto } from 'src/auth/dtos/user-credentials.dto';
// fazer a relação entre o repository e a entidade user

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // criando um usuario
  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    // desconstruindo createUser
    const { email, username, password } = createUserDto;

    // instancia de user para mandar pro banco com os dados
    const user = this.create();

    user.email = email;
    user.username = username;
    user.role = role;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hasPassword(password, user.salt);

    try {
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de email já existe.');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco.',
        );
      }
    }
  }

  async checkCredentialsUser(
    credentialsDto: UserCredentialsDto,
  ): Promise<User> {
    const { email, password } = credentialsDto;
    const user = await this.findOne({ email, status: true });

    if (user && (await user.checkPasswordUser(password))) {
      return user;
    } else {
      return null;
    }
  }

  private async hasPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
