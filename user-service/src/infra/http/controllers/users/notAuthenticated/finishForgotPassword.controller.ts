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
import { JwtForgotGuard } from '@app/auth/jwt-auth.guard';
import { IDefaultPropsJwt } from '@app/auth/jwt.core';
import { FinishForgotPasswordService } from '@app/service/notAuthenticated/finishForgotPasswordProcess.service';
import { Request } from 'express';
import { name } from '..';
import { FinishForgotPassworBody } from '../../../dto/finishForgotPasswordBody';
import { DefaultController } from '../../defaultController';

@Controller(name)
export class FinishForgotPasswordController extends DefaultController {
  constructor(
    private readonly finishForgotPasswordService: FinishForgotPasswordService,
  ) {
    super({
      possibleErrors: [
        {
          name: "The entitie doesn't exist.",
          exception: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
        },
      ],
    });
  }

  @UseGuards(JwtForgotGuard)
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
