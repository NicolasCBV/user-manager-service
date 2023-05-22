import { Controller, Get, Param, HttpCode } from '@nestjs/common';
import { GetUserService } from '@app/service/notAuthenticated/getUser.service';
import { name } from '..';
import { GetUserParam } from '@infra/http/dto/getUserParam';

@Controller(name)
export class GetUserController {
  constructor(private readonly getUserService: GetUserService) {}

  @Get(':email')
  @HttpCode(200)
  async getUser(@Param() { email }: GetUserParam) {
    const user = await this.getUserService.exec(email);

    return { user };
  }
}
