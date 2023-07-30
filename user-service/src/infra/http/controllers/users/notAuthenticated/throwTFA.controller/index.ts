import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from '@service/notAuthenticated/auth/auth.service';
import { ThrowTFABody } from '@infra/http/dto/throwTFABody';
import { name } from '../../';
import { Throttle } from '@nestjs/throttler';
import { DefaultController } from '@infra/http/controllers/defaultController';

@Throttle(3, 60)
@Controller(name)
export class ThrowTFAController extends DefaultController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('throwTFA')
  @HttpCode(200)
  async throwTFA(@Body() { email, password }: ThrowTFABody) {
    const result = await this.authService
      .validateUser({ email, password })
      .catch((err) => this.interpretErrors(err));

    if (result !== 'OK')
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
