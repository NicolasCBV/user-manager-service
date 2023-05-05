import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserService } from '@app/service/notAuthenticated/createUser.service';
import { name } from '..';
import { CreateUserBody } from '../../../dto/createUserBody';
import { Throttle } from '@nestjs/throttler';

@Throttle(2, 15)
@Controller(name)
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('create')
  @HttpCode(200)
  async createUser(@Body() body: CreateUserBody) {
    const cancelKey = await this.createUserService
      .exec(body)
      .catch((err) => {
        if (err.message === 'The entitie already exist.')
          throw new HttpException(
            err.message, 
            HttpStatus.UNAUTHORIZED
          );

        throw err;
      });

    return { cancelKey };
  } 
}
