import { Injectable } from '@nestjs/common';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { UsersRepositories } from '@src/app/repositories/users';
import { UserHandlerContract } from '../cache/contract/userHandler';

@Injectable()
export class SearchUserManager {
  constructor(
    private readonly userHandler: UserHandlerContract,
    private readonly userRepo: UsersRepositories,
  ) {}

  async exec(email: string): Promise<UserInCache> {
    let user: UserInCache | null = await this.userHandler.getUser(email);

    if (!user) {
      const searchedUser = await this.userRepo.find({ email });
      if (!searchedUser) throw new Error("This user doesn't exist");

      const TTL = 1000 * 60 * 60 * 24;
      const userForCache = new UserInCache(searchedUser);
      await this.userHandler.sendUser(userForCache, TTL);

      user = userForCache;
    }

    return user;
  }
}
