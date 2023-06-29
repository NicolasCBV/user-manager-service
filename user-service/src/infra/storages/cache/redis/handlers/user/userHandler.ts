import { OTP } from '@src/app/entities/OTP/_OTP';
import { Description } from '@src/app/entities/user/description';
import { Name } from '@src/app/entities/user/name';
import { User } from '@src/app/entities/user/_user';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { UserOnCache } from '@src/app/mappers/UserOnCache';
import { DefaultHandlerParams } from '../';
import {
  UserHandlerContract,
  UserNewContent,
} from '../../../contract/userHandler';
import { redisClient } from '../../redisClient';

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

  async updateUser(
    user: UserInCache,
    content: UserNewContent,
    ttl: number | string,
  ): Promise<void> {
    const userInUpdateState = user;

    userInUpdateState.name = content.name ? new Name(content.name) : user.name;
    userInUpdateState.description = content.description
      ? new Description(content.description)
      : user.description;
    userInUpdateState.imageUrl = content.imageUrl;

    await redisClient
      .multi()
      .set(
        `${this.userKW}:${userInUpdateState.email.value}`,
        JSON.stringify(UserOnCache.toObject(userInUpdateState)),
        'PX',
        ttl,
        'XX',
      )
      .del(`${this.userKW}:reservedName[${user.name.value}]`)
      .set(
        `${this.userKW}:reservedName[${userInUpdateState.name.value}]`,
        JSON.stringify({ createdAt: new Date() }),
        'PX',
        ttl,
        'NX',
      )
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
        JSON.stringify(user),
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
    cancelKeyOTP: OTP,
  ): Promise<void> {
    const userKey = `${this.userKW}:${email}`;
    const reservedNameKey = `${this.userKW}:reservedName[${name}]`;
    const OTPKey = `${this.otpKW}:${email}`;

    const ttl = process.env.OTP_TIME as unknown as number;

    const existentEntities = await redisClient.exists([
      userKey,
      reservedNameKey,
      OTPKey,
    ]);

    if (existentEntities !== 3) throw new Error('An error happened on redis');

    await redisClient
      .multi()
      .expire(userKey, TTL, 'XX')
      .expire(reservedNameKey, TTL, 'XX')
      .set(OTPKey, JSON.stringify(newOTP), 'PX', ttl, 'XX')
      .set(
        `${this.otpKW}:${email}.cancelKey`,
        JSON.stringify(cancelKeyOTP),
        'PX',
        ttl,
        'XX',
      )
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
