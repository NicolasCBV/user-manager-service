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
import { DefaultController } from '../../defaultController';

@Throttle(2, 15)
@Controller(name)
export class CreateUserController extends DefaultController {
  constructor(private readonly createUserService: CreateUserService) {
    super({
      possibleErrors: [
        {
          name: 'The entitie already exist.',
          exception: new HttpException(
            'The entitie already exist.',
            HttpStatus.UNAUTHORIZED,
          ),
        },
      ],
    });
  }

  @Post('create')
  @HttpCode(200)
  async createUser(@Body() body: CreateUserBody) {
    const cancelKey = await this.createUserService.exec(body).catch((err) => {
      this.interpretErrors(err);
    });

    return { cancelKey };
  }
}
