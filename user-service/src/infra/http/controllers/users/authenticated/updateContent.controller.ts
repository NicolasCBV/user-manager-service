import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { IJwtTokenUser } from '@app/auth/jwt.core';
import { UpdateUserService } from '@app/service/authenticated/updateUser.service';
import { UpdateUserBody } from '../../../dto/updateUserBody';
import { Request } from 'express';
import { name } from '..';
import { DefaultController } from '../../defaultController';

@Controller(name)
export class UpdateUserContentController extends DefaultController {
  constructor(private readonly updateUserService: UpdateUserService) {
    super();

    const {
      notFound,
      indisponible
    } = this.updateUserService.previsibileErrors;
    this.makeErrorsBasedOnMessage([
        {
          from: notFound.message,
          to: new HttpException(
            notFound.message,
            HttpStatus.NOT_FOUND,
          ),
        },
        {
          from: indisponible.message,
          to: new HttpException(
            indisponible.message,
            HttpStatus.BAD_REQUEST
          )
        }
      ]);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUser(@Req() req: Request, @Body() data: UpdateUserBody) {
    const user = req.user as IJwtTokenUser;

    await this.updateUserService
      .exec({
        id: user.sub,
        name: data.name,
        description: data.description,
      })
      .catch((err) => this.interpretErrors(err));
  }
}
