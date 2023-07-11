import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { RefreshTokenService } from '@app/service/authenticated/refreshToken.service';
import { Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { name } from '..';
import { DefaultController } from '../../defaultController';

@Controller(name)
export class RefreshTokenController extends DefaultController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {
    super();

    const { wrongToken } = this.refreshTokenService.previsibileErrors;
    const { searchForUserErrors, checkFingerprintErrors } =
      this.refreshTokenService.getExposedErrors();
    this.makeErrorsBasedOnMessage([
      {
        from: wrongToken.message,
        to: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      },
      {
        from: checkFingerprintErrors.notMatch.message,
        to: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      },
      {
        from: searchForUserErrors.unauthorized.message,
        to: new HttpException("This user doesn't exist", HttpStatus.NOT_FOUND),
      },
    ]);
  }

  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.signedCookies['refresh-cookie'];
    const deviceId = req.body?.deviceId;

    if (typeof deviceId !== 'string' && deviceId !== undefined)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    const { access_token, refresh_token } = await this.refreshTokenService
      .exec(refreshToken, req.body?.deviceId)
      .catch((err) => {
        if (err instanceof JsonWebTokenError)
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

        return this.interpretErrors(err);
      });

    const expiresDate = new Date(
      Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRES),
    );

    res.cookie('refresh-cookie', refresh_token, {
      expires: expiresDate,
      maxAge: process.env.REFRESH_TOKEN_EXPIRES as unknown as number,
      domain: process.env.CLIENT_URL as string,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && true,
      sameSite: 'strict',
      signed: true,
    });

    return { access_token };
  }
}
