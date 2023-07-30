import { HttpException, HttpStatus } from '@nestjs/common';
import { DefaultHandlerParams } from '../../storages/cache/redis/handlers';
import { SearchUserManager } from '../../storages/search/searchUserManager.service';

export type TMessageErrorsAssimilation = Array<{
  from: string;
  to: HttpException;
}>;

export class DefaultController {
  protected _messageErrors: TMessageErrorsAssimilation = [
    {
      from: new DefaultHandlerParams().cacheErrorMsg,
      to: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
    },
    {
      from: SearchUserManager.previsibleErrors.unauthorized.message,
      to: new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
    },
  ];

  interpretErrors = (inputErr: any) => {
    const err = this._messageErrors.find(
      (message) => message.from === inputErr?.message,
    );

    if (err) throw err.to;

    throw new HttpException(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };

  protected makeErrorsBasedOnMessage(input: TMessageErrorsAssimilation) {
    this._messageErrors.push(...input);
  }

  get messageErrors(): TMessageErrorsAssimilation {
    return this._messageErrors;
  }
}
