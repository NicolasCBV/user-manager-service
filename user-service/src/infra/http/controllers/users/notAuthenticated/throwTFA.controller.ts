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
import { DefaultController } from '../../defaultController';

@Throttle(3, 60)
@Controller(name)
export class ThrowTFAController extends DefaultController {
  constructor(private readonly authService: AuthService) {
    super();

    const { searchForUserErrors } = this.authService.getExposedErrors();
    this.makeErrorsBasedOnMessage([
      {
        from: searchForUserErrors.unauthorized.message,
        to: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      },
    ]);
  }

  @Post('throwTFA')
  @HttpCode(200)
  async throwTFA(@Body() { email, password }: ThrowTFABody) {
    const result = await this.authService
      .validateUser(email, password)
      .catch((err) => this.interpretErrors(err));

    if (result !== 'OK')
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
