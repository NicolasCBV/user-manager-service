import { User } from '@src/app/entities/user/_user';
import {
  ISearchQuery,
  IUserDataToUpdate,
  UsersRepositories,
} from '@src/app/repositories/users';
import { PrismaUser } from '../mappers/PrismaUser';
import { prisma } from '../prismaClient';

export class PrismaUserRepository implements UsersRepositories {
  async uploadImage(id: string, imageUrl: string): Promise<void> {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        imageUrl,
      },
    });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        password,
      },
    });
  }

  async update(user: IUserDataToUpdate): Promise<void> {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        description: user.description,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async create(user: User) {
    const userOnPrisma = PrismaUser.toPrisma(user);

    await prisma.user.create({
      data: {
        ...userOnPrisma,
      },
    });
  }

  async find(searchQuery: ISearchQuery): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: searchQuery.id },
          { name: searchQuery.name },
          { email: searchQuery.email },
          { level: searchQuery.level }
        ],
      },
    });

    return !user ? null : PrismaUser.toUserEntitie(user);
  }

  async exist(searchQuery: ISearchQuery): Promise<number> {
    const counter = await prisma.user.count({
      where: {
        OR: [
          { id: searchQuery.id },
          { name: searchQuery.name },
          { email: searchQuery.email },
        ],
      },
    });

    return counter;
  }
}
