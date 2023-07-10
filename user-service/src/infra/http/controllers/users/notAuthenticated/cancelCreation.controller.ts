import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CancelCreationService } from '@src/app/service/notAuthenticated/cancelCreation.service';
import { CancelBody } from '@src/infra/http/dto/cancelBody';
import { name } from '..';
import { Throttle } from '@nestjs/throttler';
import { DefaultController } from '../../defaultController';

@Throttle(3, 120)
@Controller(name)
export class CancelCreationController extends DefaultController {
  constructor(private readonly cancelCreation: CancelCreationService) {
    super({
      possibleErrors: [
        {
          name: 'Unauthorized',
          exception: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
        },
        {
          name: 'This user was not triggered',
          exception: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
        },
        {
          name: 'Cancel key invalid',
          exception: new HttpException(
            'Cancel key invalid',
            HttpStatus.BAD_REQUEST,
          ),
        },
      ],
    });
  }

  @Delete('cancel')
  async cancel(@Body() { email, cancelKey }: CancelBody) {
    await this.cancelCreation.exec(email, cancelKey).catch((err) => {
      this.interpretErrors(err);
    });
  }
}
