import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserService } from '@service/notAuthenticated/createUser/createUser.service';
import { name } from '../../';
import { CreateUserBody } from '@infra/http/dto/createUserBody';
import { Throttle } from '@nestjs/throttler';
import { DefaultController } from '@infra/http/controllers/defaultController';

@Throttle(4, 15)
@Controller(name)
export class CreateUserController extends DefaultController {
  constructor(private readonly createUserService: CreateUserService) {
    super();

    const { userAlreadyExist } = this.createUserService.previsibileErrors;
    this.makeErrorsBasedOnMessage([
      {
        from: userAlreadyExist.message,
        to: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      },
    ]);
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
