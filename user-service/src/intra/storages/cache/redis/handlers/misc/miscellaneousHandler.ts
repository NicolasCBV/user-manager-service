import { OTP } from '@src/app/entities/OTP/_OTP';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { UserOnObjects } from '@src/app/mappers/userInObjects';
import { UserOnCache } from '@src/app/mappers/UserOnCache';
import { DefaultHandlerParams } from '..';
import { MiscellaneousHandlerContract } from '../../../contract/miscellaneousHandler';
import { redisClient } from '../../redisClient';

export class MiscellaneousHandler
  extends DefaultHandlerParams
  implements MiscellaneousHandlerContract
{
  async del(key: string): Promise<void> {
    const result = await redisClient.del(key);

    if (!result) throw this.entitieNotExistError;
  }

  async deleteAllUserDatas(
    id: string,
    email: string,
    name: string,
  ): Promise<void> {
    await redisClient
      .multi()
      .del(`${this.userKW}:reservedName[${name}]`)
      .del(`${this.userKW}:${email}`)
      .del(`${this.otpKW}:${email}`)
      .del(`${this.otpKW}:${email}.cancelKey`)
      .del(`${this.tokenKW}:${this.tokenTypes.accessToken}.${id}`)
      .del(`${this.tokenKW}:${this.tokenTypes.refreshToken}.${id}`)
      .exec();
  }

  async startUserSigin(
    user: UserInCache,
    otp: OTP,
    cancelKeyOTP: OTP,
  ) {
    const ttl = process.env.OTP_TIME as unknown as number;
    await redisClient
      .multi()
      .set(
        `${this.userKW}:${user.email.value}`,
        JSON.stringify(UserOnCache.toObject(user)),
        'PX',
        ttl,
        'NX',
      )
      .set(
        `${this.userKW}:reservedName[${user.name.value}]`,
        JSON.stringify({ createdAt: new Date() }),
        'PX',
        ttl,
        'NX',
      )
      .set(
        `${this.otpKW}:${user.email.value}.cancelKey`,
        JSON.stringify(cancelKeyOTP),
        'PX',
        ttl,
        'NX',
      )
      .set(
        `${this.otpKW}:${user.email.value}`,
        JSON.stringify(otp),
        'PX',
        ttl,
        'NX',
      )
      .exec()
  }

  async endUserSigin(
    sub: string,
    access_token: string, 
    refresh_token: string,
    user: UserInCache,
  ): Promise<void> {
    const refresh_key = `${this.tokenKW}:refresh_token.${sub}`; 
    const access_key = `${this.tokenKW}:access_token.${sub}`;
    const ttl = 1000 * 60 * 60 * 24;

    await redisClient
      .multi()
      .set(
        access_key, 
        access_token, 
        'PX', 
        parseInt(process.env.TOKEN_EXPIRES ?? '900000')
      )
      .set(
        refresh_key, 
        refresh_token, 
        'PX', 
        parseInt(process.env.REFRESH_TOKEN_EXPIRES ?? '86400000')
      )
      .del(`${this.otpKW}:${user.email.value}`)
      .del(`${this.otpKW}:${user.email.value}.cancelKey`)
      .set(
        `${this.userKW}:${user.email.value}`, 
        JSON.stringify(UserOnObjects.toObject(user)),
        'PX',
        parseInt(process.env.REFRESH_TOKEN_EXPIRES ?? '86400000')
      )
      .expire(`${this.userKW}:reservedName[${user.name.value}]`, ttl)
      .exec()
  }

  async exist(key: string): Promise<boolean> {
    const result = await redisClient.exists(key);

    return Boolean(result);
  }
}
