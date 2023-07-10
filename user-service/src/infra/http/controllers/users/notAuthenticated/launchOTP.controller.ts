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

@Controller(name)
export class LaunchOTPController {
  constructor(private readonly launchOTPService: LaunchOTPService) {}

  @Post('launch-otp')
  @HttpCode(200)
  async launchOTPSigin(@Body() { email }: LaunchOTPBody) {
    const cancelKey = await this.launchOTPService.exec(email).catch((err) => {
      if (
        err.message === "This user doesn't requested one OTP" ||
        err.message === 'This user should not launch OTP' ||
        err.message === 'The entitie already exist' ||
        err.message === 'This user was not triggered'
      )
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      throw err;
    });

    return { cancelKey };
  }

  @Post('launch-otp-login')
  async launchOTPLogin(@Body() { email }: LaunchOTPBody) {
    const cancelKey = await this.launchOTPService
      .exec(email, true)
      .catch((err) => {
        if (
          err.message === "This user doesn't requested one OTP" ||
          err.message === 'This user should not launch OTP' ||
          err.message === "This user doesn't exist"
        )
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

        throw err;
      });

    return { cancelKey };
  }
}
