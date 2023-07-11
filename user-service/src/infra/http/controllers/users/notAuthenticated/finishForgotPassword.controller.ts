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
import { FinishForgotPasswordService } from '@app/service/notAuthenticated/finishForgotPasswordProcess.service';
import { Request } from 'express';
import { name } from '..';
import { FinishForgotPassworBody } from '../../../dto/finishForgotPasswordBody';
import { DefaultController } from '../../defaultController';
import { ForgotTokenGuard } from '@root/src/app/auth/forgot-token.guard';

@Controller(name)
export class FinishForgotPasswordController extends DefaultController {
  constructor(
    private readonly finishForgotPasswordService: FinishForgotPasswordService,
  ) {
    super();

    const { searchForUserErrors } = this.finishForgotPasswordService.getExposedErrors();
    const { unauthorized } = this.finishForgotPasswordService.previsibileErrors;
    this.makeErrorsBasedOnMessage([
      {
        from: unauthorized.message,
        to: new HttpException(unauthorized.message, HttpStatus.UNAUTHORIZED),
      },
      {
        from: searchForUserErrors.unauthorized.message,
        to: new HttpException(
          searchForUserErrors.unauthorized.message,
          HttpStatus.UNAUTHORIZED
        )
      }
    ]);
  }

  @UseGuards(ForgotTokenGuard)
  @Patch('finish-forgot-password')
  @HttpCode(200)
  async exec(
    @Req() req: Request,
    @Body() { password }: FinishForgotPassworBody,
  ) {
    const user = req.user as IDefaultPropsJwt;

    await this.finishForgotPasswordService
      .exec(user.sub, user.email, password)
      .catch((err) => this.interpretErrors(err));
  }
}
