import { Injectable } from '@nestjs/common';
import { UsersRepositories } from '@app/repositories/users';
import { ImageContract } from '@infra/api/contracts/imageContract';
import { MiscellaneousHandlerContract } from '@infra/storages/cache/contract/miscellaneousHandler';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { User } from '@src/app/entities/user/_user';
import { DefaultService } from '@app/service/defaultService';

interface IErrors {
  notFound: Error;
}

interface IDeleteUserExec {
  id: string;
  email: string;
}

@Injectable()
export class DeleteUserService extends DefaultService<IErrors> {
  constructor(
    private readonly userRepo: UsersRepositories,
    private readonly userHandler: UserHandlerContract,
    private readonly imageContract: ImageContract,
    private readonly miscHandler: MiscellaneousHandlerContract,
  ) {
    super({
      previsibleErrors: {
        notFound: new Error("This user doesn't exist"),
      },
    });
  }

  async exec({ id, email }: IDeleteUserExec) {
    let user: User | UserInCache | null = await this.userHandler.getUser(email);

    if (!user) {
      const userOnDatabase = await this.userRepo.find({ id });
      if (!userOnDatabase) throw this.previsibileErrors.notFound;

      user = userOnDatabase;
    }

    if (user.imageUrl) await this.imageContract.delete(user.imageUrl);

    await this.miscHandler.deleteAllUserDatas(
      id,
      user.email.value,
      user.name.value,
    );

    await this.userRepo.delete(id);
  }
}
