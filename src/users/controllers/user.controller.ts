import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { FindOneUserDto } from '../dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  findOne(@Body() payload: FindOneUserDto) {
    return this.userService
      .findOne(payload)
      .then((data) => data)
      .catch((error) => {
        console.error(`The following error ocurred: ${error.message}`);
        //this can be improved by using custom exception filters...
        if (error instanceof NotFoundException) {
          throw new NotFoundException(error.message);
        } else if (error instanceof BadRequestException) {
          throw new BadRequestException(error.message);
        } else {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
  }
}
