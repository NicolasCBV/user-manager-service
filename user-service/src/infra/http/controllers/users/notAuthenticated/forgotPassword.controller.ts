import {
  Controller,
  HttpException,
  Body,
  HttpStatus,
  Post,
  HttpCode,
} from '@nestjs/common';
import { ForgotPasswordService } from '@app/service/notAuthenticated/forgotPassword.service';
import { name } from '..';
import { ForgotPasswordBody } from '../../../dto/forgotPassword';
import { Throttle } from '@nestjs/throttler';
import { DefaultController } from '../../defaultController';

@Throttle(1, 30)
@Controller(name)
export class ForgotPasswordController extends DefaultController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {
    super({
      possibleErrors: [
        {
          name: 'The entitie already exist.',
          exception: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
        },
        {
          name: "This user doesn't exist",
          exception: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
        },
      ],
    });
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() { email, deviceId }: ForgotPasswordBody) {
    if (typeof deviceId !== 'string' && deviceId !== undefined)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    await this.forgotPasswordService.exec(email, deviceId).catch((err) => {
      this.interpretErrors(err);
    });
  }
}
