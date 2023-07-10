import { HttpException, HttpStatus } from '@nestjs/common';

export type TMessageErrors = Array<{
  name: string;
  exception: HttpException;
}>;

interface IProps {
  possibleErrors: TMessageErrors;
}

export class DefaultController {
  private _messageErrors: TMessageErrors;

  constructor(input: IProps) {
    this._messageErrors = input.possibleErrors;
  }

  interpretErrors = (inputErr: any) => {
    const err = this.messageErrors.find(
      (message) => message.name === inputErr?.message,
    );

    if (err) throw err.exception;

    throw new HttpException(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };

  get messageErrors(): TMessageErrors {
    return this._messageErrors;
  }
}
