import { createMockExecutionContext } from '@root/test/mocks/guards/executionContext';
import { IDefaultPropsJwt } from '../../../jwt.core';
import { getRefreshTokenGuardModule } from './getModule';

export const createDefaultSituationOnRTGuard = async (
  tokenContent: string,
  token: IDefaultPropsJwt,
) => {
  const { refreshTokenGuard, ...dependencies } =
    await getRefreshTokenGuardModule();
  await dependencies.tokenHandler.sendToken({
    id: token.sub,
    type: token.type,
    content: 'content_token',
    expiresIn: token.iat,
  });

  const executionContextMock = createMockExecutionContext({
    headers: {
      cookie: `refresh-cookie=${tokenContent}`,
    },
  });

  const exec = () => refreshTokenGuard.canActivate(executionContextMock);

  return {
    exec,
    dependencies,
  };
};
