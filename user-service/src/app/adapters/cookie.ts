type TValidateSignedCookieReturn = string | false;

export interface IValidateSignedCookie {
  cookie: string;
  key: string;
}

export abstract class CookieAdapter {
  abstract validateSignedCookie(
    data: IValidateSignedCookie,
  ): Promise<string | false> | TValidateSignedCookieReturn;
}
