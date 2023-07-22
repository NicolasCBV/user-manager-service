import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenService } from '@service/authenticated/refreshToken/refreshToken.service';
import { Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { name } from '../../';
import { DefaultController } from '@infra/http/controllers/defaultController';
import { RefreshTokenGuard } from '@app/auth/guards/refresh-token.guard';
import { RefreshTokenBody } from '@infra/http/dto/refreshTokenBody';
import { IDefaultPropsJwt } from '@app/auth/jwt.core';
import { FingerprintGuard } from '@app/auth/guards/fingerprint.guard';

@Controller(name)
export class RefreshTokenController extends DefaultController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {
    super();

    const { wrongToken } = this.refreshTokenService.previsibileErrors;

    this.makeErrorsBasedOnMessage([
      {
        from: wrongToken.message,
        to: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      },
    ]);
  }

  @UseGuards(RefreshTokenGuard, FingerprintGuard)
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: RefreshTokenBody,
  ) {
    const tokenData = req.user as IDefaultPropsJwt;
    const { access_token, refresh_token } = await this.refreshTokenService
      .exec({ tokenData })
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
