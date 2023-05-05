import { Body, Controller, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CancelCreationService } from '@src/app/service/notAuthenticated/cancelCreation.service';
import { CancelBody } from '@src/intra/http/dto/cancelBody';
import { name } from '..'

@Controller(name)
export class CancelCreationController {
  constructor(
    private readonly cancelCreation: CancelCreationService
  ) {}

  @Delete('cancel')
  async cancel(@Body() { email, cancelKey }: CancelBody) {
    await this.cancelCreation.exec(email, cancelKey)
      .catch((err) => {
        if (
          err.message === 'Unauthorized' || 
          err.message === 'This user was not triggered' || 
          err.message === 'Cancel key invalid'
        ) 
          throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
          throw err;
      });
  }
}
