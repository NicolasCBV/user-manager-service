import { User } from '@app/entities/user/_user';
import { Description } from '@app/entities/user/description';
import { Name } from '@app/entities/user/name';
import { Password } from '@app/entities/user/password';
import {
  ISearchQuery,
  IUserDataToUpdate,
  UsersRepositories,
} from '@src/app/repositories/users';

export class InMemmoryUser implements UsersRepositories {
  public users: User[] = [];

  async create(newUser: User): Promise<void> {
    const checkExistenceUser = this.users.find(
      (user) =>
        user.id === newUser.id ||
        user.name.value === newUser.name.value ||
        user.email.value === newUser.email.value,
    );

    if (checkExistenceUser) throw new Error('This user already exist');

    this.users.push(newUser);
  }

  async exist(searchQuery: ISearchQuery): Promise<number> {
    const users = this.users.filter(
      (user) =>
        searchQuery.id === searchQuery.id ||
        searchQuery.name === user.name.value ||
        searchQuery.email === user.email.value,
    );

    return users.length;
  }

  async find(data: ISearchQuery): Promise<User | null> {
    const user = this.users.find(
      (user) =>
        data.id === user.id ||
        data.name === user.name.value ||
        data.email === user.email.value,
    );

    return user ?? null;
  }

  async delete(id: string): Promise<void> {
    const user = this.users.find((_user) => _user.id === id);

    if (!user) throw new Error("This user doesn't exist");

    const userIndex = this.users.findIndex((_user) => _user.id === id);

    this.users.splice(userIndex, 1);
  }

  async update(userData: IUserDataToUpdate): Promise<void> {
    const user = this.users.find((_user) => _user.id === userData.id);

    if (!user) throw new Error("This user doesn't exist");

    const userIndex = this.users.findIndex((_user) => _user.id === userData.id);

    this.users[userIndex] = new User(
      {
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        name:
          typeof userData.name === 'string'
            ? new Name(userData.name)
            : user.name,
        description:
          typeof userData.description === 'string'
            ? new Description(userData.description)
            : user.description,
        imageUrl: user.imageUrl,
      },
      user.id,
    );
  }
  async uploadImage(id: string, imageUrl: string): Promise<void> {
    const user = this.users.find((_user) => _user.id === id);

    if (!user) throw new Error("This user doesn't exist");

    const userIndex = this.users.findIndex((_user) => _user.id === id);

    this.users[userIndex].imageUrl = imageUrl;
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const user = this.users.find((_user) => _user.id === id);

    if (!user) throw new Error("This user doesn't exist");

    const userIndex = this.users.findIndex((_user) => _user.id === id);

    this.users[userIndex].password = new Password(password);
  }
}
