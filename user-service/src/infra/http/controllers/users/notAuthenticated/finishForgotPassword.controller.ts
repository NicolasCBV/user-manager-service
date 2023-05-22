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

@Controller(name)
export class FinishForgotPasswordController {
  constructor(
    private readonly finishForgotPasswordService: FinishForgotPasswordService,
  ) {}

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
      .catch((err) => {
        if (err.message === "The entitie doesn't exist.")
          throw new HttpException(err.message, HttpStatus.CONFLICT);

        throw err;
      });
  }
}
