import { Inject, Injectable } from '@nestjs/common';
import { User } from '@src/app/entities/user/_user';
import {
  UsersRepositories,
  ISearchQuery,
  IUserDataToUpdate,
} from '@src/app/repositories/users';
import { Repository } from 'typeorm';
import { typeORMConsts } from '../../constants';
import { TypeORMUserMapper } from '../../mappers/typeORMUser';
import { TypeORMUser } from './users.entity';

@Injectable()
export class UserService implements UsersRepositories {
  constructor(
    @Inject(typeORMConsts.userProvider)
    private repo: Repository<TypeORMUser>,
  ) {}

  async create(rawUser: User): Promise<void> {
    await this.repo.insert({ ...TypeORMUserMapper.toTypeORM(rawUser) });
  }

  async exist(searchQuery: ISearchQuery): Promise<number> {
    return Number(
      await this.repo.exist({
        where: [
          { id: searchQuery.id },
          { name: searchQuery.name },
          { email: searchQuery.email },
        ],
      }),
    );
  }

  async find(searchQuery: ISearchQuery): Promise<User | null> {
    const user = await this.repo.findOne({
      where: [
        { id: searchQuery.id },
        { name: searchQuery.name },
        { email: searchQuery.email },
      ],
    });

    return user ? TypeORMUserMapper.toUserEntitie(user) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async update(user: IUserDataToUpdate): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(TypeORMUser)
      .set({
        name: user.name,
        description:
          typeof user.description === 'string' ? user.description : undefined,
      })
      .where('id = :id', { id: user.id })
      .execute();
  }

  async uploadImage(id: string, imageUrl: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(TypeORMUser)
      .set({ imageUrl })
      .where('id = :id', { id })
      .execute();
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(TypeORMUser)
      .set({ password })
      .where('id = :id', { id })
      .execute();
  }
}
