import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  HttpCode,
} from '@nestjs/common';
import { RelaunchOTPService } from '@app/service/notAuthenticated/relaunchOTP/relaunchOTP.service';
import { name } from '../../';
import { LaunchOTPBody } from '@infra/http/dto/launchOTPBody';
import { DefaultController } from '@infra/http/controllers/defaultController';

@Controller(name)
export class RelaunchOTPController extends DefaultController {
  constructor(private readonly relaunchOTPService: RelaunchOTPService) {
    super();

    const { indisponible } = this.relaunchOTPService.previsibileErrors;
    this.makeErrorsBasedOnMessage([
      {
        from: indisponible.message,
        to: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      },
    ]);
  }

  @Post('launch-otp')
  @HttpCode(200)
  async launchOTPSigin(@Body() { email }: LaunchOTPBody) {
    const cancelKey = await this.relaunchOTPService
      .exec({ email })
      .catch((err) => {
        this.interpretErrors(err);
      });

    return { cancelKey };
  }

  @Post('launch-otp-login')
  async launchOTPLogin(@Body() { email }: LaunchOTPBody) {
    const cancelKey = await this.relaunchOTPService
      .exec({ email, isLoging: true })
      .catch((err) => this.interpretErrors(err));

    return { cancelKey };
  }
}
