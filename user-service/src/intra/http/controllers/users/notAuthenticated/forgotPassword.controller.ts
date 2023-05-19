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

@Throttle(1, 30)
@Controller(name)
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() { email, deviceId }: ForgotPasswordBody) {
    if (typeof deviceId !== 'string' && deviceId !== undefined)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    await this.forgotPasswordService.exec(email, deviceId).catch((err) => {
      if (err.message === 'The entitie already exist.')
        throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);

      if (err.message === "This user doesn't exist")
        throw new HttpException(err.message, HttpStatus.CONFLICT);

      throw err;
    });
  }
}
