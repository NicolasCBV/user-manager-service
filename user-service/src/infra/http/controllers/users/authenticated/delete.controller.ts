import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { IJwtTokenUser } from '@app/auth/jwt.core';
import { DeleteUserService } from '@app/service/authenticated/deleteUser.service';
import { Request } from 'express';
import { name } from '..';

@Controller(name)
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteUser(@Req() req: Request) {
    const user = req.user as IJwtTokenUser;

    await this.deleteUserService.exec(user.sub, user.email).catch((err) => {
      if (err.message === "This user doesn't exist")
        throw new HttpException(err.message, HttpStatus.CONFLICT);

      throw err;
    });
  }
}
