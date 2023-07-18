import { Controller, Body, Post, HttpCode } from '@nestjs/common';
import { ForgotPasswordService } from '@service/notAuthenticated/forgotPassword/forgotPassword.service';
import { name } from '../../';
import { ForgotPasswordBody } from '@infra/http/dto/forgotPassword';
import { Throttle } from '@nestjs/throttler';
import { DefaultController } from '@infra/http/controllers/defaultController';

@Throttle(5, 30)
@Controller(name)
export class ForgotPasswordController extends DefaultController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {
    super();
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() { email, deviceId }: ForgotPasswordBody) {
    await this.forgotPasswordService.exec({ email, deviceId }).catch((err) => {
      this.interpretErrors(err);
    });
  }
}
