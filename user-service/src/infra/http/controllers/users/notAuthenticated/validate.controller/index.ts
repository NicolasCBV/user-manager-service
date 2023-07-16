import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ValidateAccountService } from '@app/service/notAuthenticated/validateAccount/validateAccount.service';
import { Response } from 'express';
import { name } from '../../';
import { ValidateUserBody } from '@infra/http/dto/validateUserBody';
import { DefaultController } from '@infra/http/controllers/defaultController';

@Controller(name)
export class ValidateUserController extends DefaultController {
  constructor(private readonly validateAccountService: ValidateAccountService) {
    super();
  }

  @Post('validate')
  async validateUser(
    @Res({ passthrough: true }) res: Response,
    @Body() body: ValidateUserBody,
  ) {
    const { access_token, refresh_token } = await this.validateAccountService
      .exec(body)
      .catch((err) => {
        if (
          err.message === 'This user is not in validation step' ||
          err.message === 'Unauthorized' ||
          err.message === 'The entitie already exist.'
        )
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

        throw err;
      });

    const expiresDate = new Date(
      Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRES),
    );

    res.cookie('refresh-cookie', refresh_token, {
      expires: expiresDate,
      maxAge: process.env.REFRESH_TOKEN_EXPIRES as unknown as number,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && true,
      sameSite: 'strict',
      signed: true,
    });

    return { access_token };
  }
}
