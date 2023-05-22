import { isJWT } from 'class-validator';

export class Token {
  private _token: string;

  checkData(data: string) {
    return isJWT(data);
  }

  constructor(token: string) {
    const result = this.checkData(token);

    if (!result) throw new Error('This token is not a JWT');

    this._token = token;
  }

  get token(): string {
    return this._token;
  }
}
