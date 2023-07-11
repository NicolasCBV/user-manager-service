import { HttpException, HttpStatus } from '@nestjs/common';

export type TMessageErrorsAssimilation = Array<{
  from: string;
  to: HttpException;
}>;

export class DefaultController {
  protected _messageErrors: TMessageErrorsAssimilation = [];

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
    this._messageErrors = input;
  }

  get messageErrors(): TMessageErrorsAssimilation {
    return this._messageErrors;
  }
}
