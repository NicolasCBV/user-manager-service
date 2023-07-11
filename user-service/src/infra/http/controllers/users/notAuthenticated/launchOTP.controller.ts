import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  HttpCode,
} from '@nestjs/common';
import { LaunchOTPService } from '@app/service/notAuthenticated/launchOTP.service';
import { name } from '..';
import { LaunchOTPBody } from '../../../dto/launchOTPBody';
import { DefaultController } from '../../defaultController';

@Controller(name)
export class LaunchOTPController extends DefaultController {
  constructor(private readonly launchOTPService: LaunchOTPService) {
    super();

    const { indisponible } = this.launchOTPService.previsibileErrors;
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
    const cancelKey = await this.launchOTPService.exec(email).catch((err) => {
      this.interpretErrors(err);
    });

    return { cancelKey };
  }

  @Post('launch-otp-login')
  async launchOTPLogin(@Body() { email }: LaunchOTPBody) {
    const cancelKey = await this.launchOTPService
      .exec(email, true)
      .catch((err) => this.interpretErrors(err));

    return { cancelKey };
  }
}
