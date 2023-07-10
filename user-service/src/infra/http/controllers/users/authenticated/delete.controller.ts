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
import { DefaultController } from '../../defaultController';

@Controller(name)
export class DeleteUserController extends DefaultController {
  constructor(private readonly deleteUserService: DeleteUserService) {
    super({
      possibleErrors: [
        {
          name: "This user doesn't exist",
          exception: new HttpException(
            "This user doesn't exist",
            HttpStatus.NOT_FOUND,
          ),
        },
      ],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteUser(@Req() req: Request) {
    const user = req.user as IJwtTokenUser;

    await this.deleteUserService.exec(user.sub, user.email).catch((err) => {
      this.interpretErrors(err);
    });
  }
}
