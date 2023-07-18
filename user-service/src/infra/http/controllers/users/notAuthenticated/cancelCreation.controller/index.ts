import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CancelCreationService } from '@service/notAuthenticated/cancelCreation/cancelCreation.service';
import { CancelBody } from '@infra/http/dto/cancelBody';
import { name } from '../../';
import { Throttle } from '@nestjs/throttler';
import { DefaultController } from '@infra/http/controllers/defaultController';

@Throttle(3, 120)
@Controller(name)
export class CancelCreationController extends DefaultController {
  constructor(private readonly cancelCreation: CancelCreationService) {
    super();

    const { unauthorized } = this.cancelCreation.previsibileErrors;
    this.makeErrorsBasedOnMessage([
      {
        from: unauthorized.message,
        to: new HttpException(unauthorized.message, HttpStatus.UNAUTHORIZED),
      },
    ]);
  }

  @Delete('cancel')
  async cancel(@Body() { email, cancelKey }: CancelBody) {
    await this.cancelCreation.exec({ email, cancelKey }).catch((err) => {
      this.interpretErrors(err);
    });
  }
}
