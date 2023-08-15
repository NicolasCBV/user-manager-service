/* Handlers will be refactored soon */

import { OTP } from '@src/app/entities/OTP/_OTP';
import { User } from '@src/app/entities/user/_user';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { UserOnCache } from '@src/app/mappers/UserOnCache';
import { DefaultHandlerParams } from '../';
import { UserHandlerContract } from '../../../contract/userHandler';
import { redisClient } from '../../redisClient';
import { CacheError } from '../errors/cacheError';

export class UserHandler
  extends DefaultHandlerParams
  implements UserHandlerContract
{
  async sendUser(user: UserInCache, ttl: string | number): Promise<void> {
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
      .exec();
  }

  async updateTTL(user: UserInCache, ttl: string | number): Promise<void> {
    await redisClient
      .multi()
      .expire(`${this.userKW}:${user.email.value}`, ttl)
      .expire(`${this.userKW}:reservedName[${user.name.value}]`, ttl)
      .exec();
  }

  async forceUpdate(
    oldUser: UserInCache | User,
    user: UserInCache,
    ttl: string | number,
  ): Promise<void> {
    await redisClient
      .multi()
      .del(`${this.userKW}:reservedName[${oldUser.name.value}]`)
      .set(
        `${this.userKW}:${user.email.value}`,
        JSON.stringify(UserOnCache.toObject(user)),
        'PX',
        ttl,
      )
      .set(
        `${this.userKW}:reservedName[${user.name.value}]`,
        JSON.stringify({ createdAt: new Date() }),
        'PX',
        ttl,
        'NX',
      )
      .exec();
  }

  async getUser(email: string): Promise<UserInCache | null> {
    const rawStringUser = await redisClient.get(`${this.userKW}:${email}`);

    if (!rawStringUser) return null;

    const rawUser = JSON.parse(rawStringUser);

    const user = UserOnCache.fromJsonToClass(rawUser);

    return user;
  }

  async sendOTPForUser(
    user: UserInCache,
    ttl: number,
    otp: OTP,
    cancelKeyOTP: OTP,
  ): Promise<void> {
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
      .exec();
  }

  async resendOTPForUser(
    email: string,
    name: string,
    TTL: number,
    newOTP: OTP,
    cancelKeyOTP?: OTP,
    isLoging?: boolean
  ): Promise<void> {
    const userKey = `${this.userKW}:${email}`;
    const reservedNameKey = `${this.userKW}:reservedName[${name}]`;
    const OTPKey = `${isLoging ? "auth:" : ""}${this.otpKW}:${email}`;

    const otpTTL = process.env.OTP_TIME as unknown as number;

    const existentEntities = await redisClient.exists([
      userKey,
      reservedNameKey,
      OTPKey,
    ]);

    if (existentEntities !== 3)
      throw new CacheError({
        name: "ERR: entities doesn't exist",
        message: this.cacheErrorMsg,
        state: `received ${existentEntities} instead 3`,
      });

    cancelKeyOTP
      ? await redisClient
          .multi()
          .expire(userKey, TTL, 'XX')
          .expire(reservedNameKey, TTL, 'XX')
          .set(OTPKey, JSON.stringify(newOTP), 'PX', otpTTL, 'XX')
          .set(
            `${this.otpKW}:${email}.cancelKey`,
            JSON.stringify(cancelKeyOTP),
            'PX',
            otpTTL,
            'XX',
          )
          .exec()
      : await redisClient
          .multi()
          .expire(userKey, TTL, 'XX')
          .expire(reservedNameKey, TTL, 'XX')
          .set(OTPKey, JSON.stringify(newOTP), 'PX', otpTTL, 'XX')
          .exec();
  }

  async existUser(email: string, name: string): Promise<boolean> {
    const results = await redisClient
      .multi()
      .exists(`${this.userKW}:${email}`)
      .exists(`${this.userKW}:reservedName[${name}]`)
      .exec();

    if (results) {
      const getAllResponses = results.map((result) => result[1]);
      const itExists = getAllResponses.every((response) => response);

      return Boolean(itExists);
    }

    return Boolean(results);
  }
}
