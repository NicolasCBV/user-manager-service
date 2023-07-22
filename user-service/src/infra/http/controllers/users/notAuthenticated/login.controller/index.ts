import {
  Post,
  Controller,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from '@service/notAuthenticated/auth/auth.service';
import { Response } from 'express';
import { name } from '../../';
import { LoginUserBody } from '@infra/http/dto/loginUser';
import { Throttle } from '@nestjs/throttler';
import { DefaultController } from '@infra/http/controllers/defaultController';

@Throttle(3, 60)
@Controller(name)
export class LoginController extends DefaultController {
  constructor(private readonly authService: AuthService) {
    super();

    const { unauthorized } = this.authService.previsibileErrors;
    this.makeErrorsBasedOnMessage([
      {
        from: unauthorized.message,
        to: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      },
    ]);
  }

  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) res: Response,
    @Body() { email, code, deviceId }: LoginUserBody,
  ) {
    const data = await this.authService
      .login({ userEmail: email, code, deviceId })
      .catch((err) => this.interpretErrors(err));

    const expiresDate = new Date(
      Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRES),
    );

    res.cookie('refresh-cookie', data.refresh_token, {
      expires: expiresDate,
      maxAge: process.env.REFRESH_TOKEN_EXPIRES as unknown as number,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && true,
      sameSite: 'strict',
      signed: true,
    });

    return { access_token: data.access_token };
  }
}
