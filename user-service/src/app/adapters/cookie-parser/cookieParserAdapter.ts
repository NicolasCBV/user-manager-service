import { signedCookie } from 'cookie-parser';
import { CookieAdapter, IValidateSignedCookie } from '../cookie';

export class CookieParserAdapter implements CookieAdapter {
  validateSignedCookie({ cookie, key }: IValidateSignedCookie): string | false {
    const result = signedCookie(cookie, key);
    return result;
  }
}
