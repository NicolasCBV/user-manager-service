import { createMockExecutionContext } from '@root/test/mocks/guards/executionContext';
import { IDefaultPropsJwt } from '../../../jwt.core';
import { getForgotTokenGuardModule } from './getModule';

export const createDefaultSituationOnForgotTokenGuard = async (
  token: IDefaultPropsJwt,
  tokenId?: string,
) => {
  const { forgotTokenGuard, ...dependencies } =
    await getForgotTokenGuardModule();
  const mockContext = createMockExecutionContext({
    headers: {
      authorization: tokenId,
    },
  });

  await dependencies.tokenHandler.sendToken({
    id: token.sub,
    type: token.type,
    content: tokenId ?? 'Bearer token id',
    expiresIn: Date.now() + 10000,
  });

  const exec = () => forgotTokenGuard.canActivate(mockContext);

  return {
    exec,
    dependencies,
  };
};
