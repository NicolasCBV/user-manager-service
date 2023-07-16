import { Controller, Get, Param, HttpCode } from '@nestjs/common';
import { GetUserService } from '@app/service/notAuthenticated/getUser/getUser.service';
import { name } from '../../';
import { GetUserParam } from '@infra/http/dto/getUserParam';
import { DefaultController } from '@infra/http/controllers/defaultController';

@Controller(name)
export class GetUserController extends DefaultController {
  constructor(private readonly getUserService: GetUserService) {
    super();
  }

  @Get(':email')
  @HttpCode(200)
  async getUser(@Param() { email }: GetUserParam) {
    const user = await this.getUserService.exec({ email });

    return { user };
  }
}
