import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from '@app/service/notAuthenticated/auth.service';
import { ThrowTFABody } from '@infra/http/dto/throwTFABody';
import { name } from '..';
import { Throttle } from '@nestjs/throttler';

@Throttle(3, 60)
@Controller(name)
export class ThrowTFAController {
  constructor(private readonly authService: AuthService) {}

  @Post('throwTFA')
  @HttpCode(200)
  async throwTFA(@Body() { email, password }: ThrowTFABody) {
    const result = await this.authService
      .validateUser(email, password)
      .catch((err) => {
        if (
          err.message === "This user doesn't exist" ||
          err.message === 'This user should not launch OTP'
        )
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      });

    if (result !== 'OK')
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
