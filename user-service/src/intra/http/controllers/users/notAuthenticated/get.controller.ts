import {
  Controller,
  Post,
  Body,
  HttpCode,
} from '@nestjs/common';
import { GetUserService } from '@app/service/notAuthenticated/getUser.service';
import { name } from '..';
import { GetUserBody } from '@src/intra/http/dto/getUserBody';

@Controller(name)
export class GetUserController {
  constructor(private readonly getUserService: GetUserService) {}

  @Post('get')
  @HttpCode(200)
  async getUser(@Body() { email }: GetUserBody) {
    const user = await this.getUserService.exec(email);

    return { user };
  }
}
