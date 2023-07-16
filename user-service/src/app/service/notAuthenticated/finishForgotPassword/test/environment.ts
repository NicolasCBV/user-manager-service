import { UserInCache } from '@root/src/app/entities/userInCache/userInCache';
import { SearchUserManager } from '@root/src/infra/storages/search/searchUserManager.service';
import { userFactory } from '@root/test/fatories/user';
import { getFinishForgotPasswordModule } from './getModule';

export const createDefaultSituationOnFFPServ = async () => {
  const user = userFactory();
  SearchUserManager.prototype.exec = jest.fn(async () => new UserInCache(user));
  const { finishForgotPassword, ...dependencies } =
    await getFinishForgotPasswordModule();

  await dependencies.userRepo.create(user);
  await dependencies.userHandler.sendUser(new UserInCache(user), 10000);
  await dependencies.tokenHandler.sendToken({
    id: user.id,
    content: 'content',
    expiresIn: Date.now() + 10000,
    type: 'forgot_token',
  });

  const exec = () =>
    finishForgotPassword.exec({
      sub: user.id,
      email: user.email.value,
      password: 'new password',
    });
  return { exec, user, dependencies };
};
