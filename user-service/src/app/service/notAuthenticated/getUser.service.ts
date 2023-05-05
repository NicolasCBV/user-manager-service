import { Injectable } from '@nestjs/common';
import { UserOnCache } from '@src/app/mappers/UserOnCache';
import { SearchUserManager } from '@src/intra/storages/search/searchUserManager.service';
import { UserObject } from '../../mappers/userInObjects';

type IUnsensitiveUserData = Omit<
  UserObject,
  'password' | 'phoneNumber' | 'email'
>;

@Injectable()
export class GetUserService {
  constructor(private searchManager: SearchUserManager) {}

  async exec(email: string): Promise<IUnsensitiveUserData | null> {
    const user = await this.searchManager
      .exec(email)
      .catch((err) => {
        if(err.message === "This user doesn't exist") 
          return null;
      });

    if(!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { 
      password, 
      ['email']: _email, 
      ...rest 
    } = UserOnCache.toObject(user!);

    return rest;
  }
}
