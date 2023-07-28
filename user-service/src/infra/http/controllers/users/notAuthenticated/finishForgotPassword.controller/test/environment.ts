import { userFactory } from '@test/fatories/user';
import { IFinishForgotPasswordModReturn } from './getModule';
import * as request from 'supertest';
import { randomUUID } from 'crypto';
import { Password } from '@root/src/app/entities/user/password';

type TProps = {
  shouldCreateContent: boolean;
  deviceIdInput?: string;
  deviceIdOutput?: string;
} & IFinishForgotPasswordModReturn;

export const createDefaultEnvOnFinishForgotPasswordE2E = async ({
  shouldCreateContent,
  deviceIdInput,
  deviceIdOutput,
  app,
  userRepo,
  ...dependencies
}: TProps) => {
  const sub = randomUUID();
  const password = new Password(await dependencies.crypt.hash('1234Df'));
  const user = userFactory({ password });

  if (shouldCreateContent) {
    const token = dependencies.jwtService.sign(
      {
        sub,
        email: user.email.value,
        type: 'forgot_token',
        deviceId: deviceIdOutput
          ? await dependencies.crypt.hash(deviceIdOutput)
          : null,
      },
      {
        secret: process.env.FORGOT_TOKEN_KEY as string,
        expiresIn: parseInt(process.env.FORGOT_TOKEN_EXPIRES ?? '120000'),
      },
    );

    await dependencies.tokenHandler.sendToken({
      id: sub,
      type: 'forgot_token',
      content: token,
      expiresIn: parseInt(process.env.FORGOT_TOKEN_EXPIRES ?? '120000'),
    });
    await userRepo.create(user);
  }

  const res = await request(app.getHttpServer())
    .patch('/users/finish-forgot-password')
    .send({
      email: user.email.value,
      password: '1234NewPassword',
      deviceId: deviceIdInput,
    })
    .set('authorization', `Bearer ${sub}`)
    .set('Content-Type', 'application/json');

  const newUser = await userRepo.find({ id: user.id });
  return {
    res,
    dependencies,
    oldPassword: password.value,
    newPassword: newUser,
  };
};
