interface ITokenTypes {
  refreshToken: 'refresh_token';
  accessToken: 'access_token';
  forgotToken: 'forgot_token';
}

export class DefaultHandlerParams {
  tokenKW = 'token';
  userKW = 'user';
  otpKW = 'OTP';

  cacheErrorMsg = 'Could not finish operation on cache';

  tokenTypes: ITokenTypes = {
    refreshToken: 'refresh_token',
    accessToken: 'access_token',
    forgotToken: 'forgot_token',
  };
}
