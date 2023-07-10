import {
  Post,
  Controller,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from '@app/service/notAuthenticated/auth.service';
import { Response } from 'express';
import { name } from '..';
import { LoginUserBody } from '../../../dto/loginUser';
import { Throttle } from '@nestjs/throttler';
import { DefaultController } from '../../defaultController';

@Throttle(3, 60)
@Controller(name)
export class LoginController extends DefaultController {
  constructor(private readonly authService: AuthService) {
    super({
      possibleErrors: [
        {
          name: "This user doesn't exist",
          exception: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
        },
        {
          name: 'Unathorized',
          exception: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
        },
      ],
    });
  }

  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) res: Response,
    @Body() { email, code, deviceId }: LoginUserBody,
  ) {
    if (typeof deviceId !== 'string' && deviceId !== undefined)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    const data = await this.authService
      .login(email, code, deviceId)
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
