interface ITokenTypes {
  refreshToken: 'refresh_token';
  accessToken: 'access_token';
  forgotToken: 'forgot_token';
}

export class DefaultHandlerParams {
  tokenKW = 'token';
  userKW = 'user';
  otpKW = 'OTP';

  entitieError = new Error('The entitie already exist.');
  entitieNotExistError = new Error("The entitie doesn't exist.");

  tokenTypes: ITokenTypes = {
    refreshToken: 'refresh_token',
    accessToken: 'access_token',
    forgotToken: 'forgot_token',
  };
}
