import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IDefaultPropsJwt } from '@app/auth/jwt.core';
import { FinishForgotPasswordService } from '@service/notAuthenticated/finishForgotPassword/finishForgotPassword.service';
import { Request } from 'express';
import { name } from '../../';
import { FinishForgotPasswordBody } from '@infra/http/dto/finishForgotPasswordBody';
import { DefaultController } from '@infra/http/controllers/defaultController';
import { ForgotTokenGuard } from '@app/auth/guards/forgot-token.guard';
import { Throttle } from '@nestjs/throttler';
import { FingerprintGuard } from '@app/auth/guards/fingerprint.guard';

@Throttle(3, 120)
@Controller(name)
export class FinishForgotPasswordController extends DefaultController {
  constructor(
    private readonly finishForgotPasswordService: FinishForgotPasswordService,
  ) {
    super();

    const { unauthorized } = this.finishForgotPasswordService.previsibileErrors;
    this.makeErrorsBasedOnMessage([
      {
        from: unauthorized.message,
        to: new HttpException(unauthorized.message, HttpStatus.UNAUTHORIZED),
      },
    ]);
  }

  @UseGuards(ForgotTokenGuard, FingerprintGuard)
  @Patch('finish-forgot-password')
  @HttpCode(200)
  async exec(
    @Req() req: Request,
    @Body() { password }: FinishForgotPasswordBody,
  ) {
    const user = req.user as IDefaultPropsJwt;

    await this.finishForgotPasswordService
      .exec({
        sub: user.sub,
        email: user.email,
        password,
      })
      .catch((err) => this.interpretErrors(err));
  }
}
