import { Injectable } from '@nestjs/common';
import { UsersRepositories } from '../../repositories/users';
import { ImageContract } from '@infra/api/contracts/imageContract';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { User } from '@src/app/entities/user/_user';

@Injectable()
export class DeleteUserService {
  constructor(
    private readonly userRepo: UsersRepositories,
    private readonly userHandler: UserHandlerContract,
    private readonly imageContract: ImageContract,
    private readonly miscHandler: MiscellaneousHandlerContract,
  ) {}

  async exec(id: string, email: string) {
    let user: User | UserInCache | null = await this.userHandler.getUser(email);

    if (!user) {
      const userOnDatabase = await this.userRepo.find({ id });
      if (!userOnDatabase) throw new Error("This user doesn't exist");

      user = userOnDatabase;
    }

    await this.miscHandler.deleteAllUserDatas(
      id,
      user.email.value,
      user.name.value,
    );

    if (user.imageUrl) await this.imageContract.delete(user.imageUrl);

    await this.userRepo.delete(id);
  }
}
