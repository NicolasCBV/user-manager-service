import { Injectable } from '@nestjs/common';
import { Description } from '@src/app/entities/user/description';
import { Name } from '@src/app/entities/user/name';
import { UserInCache } from '@src/app/entities/userInCache/userInCache';
import { UserHandlerContract } from '@infra/storages/cache/contract/userHandler';
import { UsersRepositories } from '@app/repositories/users';
import { DefaultService } from '../../defaultService';

interface IErrors {
  indisponible: Error;
  notFound: Error;
}

interface IUpdateUserBody {
  id: string;
  name: string;
  description?: string | null;
}

@Injectable()
export class UpdateUserService extends DefaultService<IErrors> {
  constructor(
    private readonly userRepo: UsersRepositories,
    private readonly userHandler: UserHandlerContract,
  ) {
    super({
      previsibleErrors: {
        indisponible: new Error('This feature is indisponible.'),
        notFound: new Error("This user doesn't exist"),
      },
    });
  }

  async exec({ id, name, description }: IUpdateUserBody): Promise<void> {
    const oldUser = await this.userRepo.find({ id });

    if (!oldUser) throw this.previsibileErrors.notFound;

    await this.userRepo.update({
      id,
      name,
      description: description ? description : null,
    });

    const newUser = new UserInCache(oldUser);
    newUser.name = new Name(name);
    newUser.description = description ? new Description(description) : null;

    const newTTL = 1000 * 60 * 60 * 24;

    await this.userHandler.forceUpdate(oldUser, newUser, newTTL);
  }
}
