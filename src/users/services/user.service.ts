import { Injectable } from '@nestjs/common/decorators';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { FindOneUserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async findOne(payload: FindOneUserDto) {
    const { username, password } = payload;

    const user = await this.usersRepository.findOne({
      where: { username },
      select: ['password', 'fullname'],
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Incorrect password!'); // or UnauthorizedException ... anyways it would be better to have custom exceptions
    }

    return { fullname: user.fullname };
  }
}
