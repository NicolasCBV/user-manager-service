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

@Controller(name)
export class UpdateUserContentController {
  constructor(private readonly updateUserService: UpdateUserService) {}

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
      .catch((err) => {
        if (err.message === "This user doesn't exist")
          throw new HttpException(err.message, HttpStatus.CONFLICT);

        throw err;
      });
  }
}
