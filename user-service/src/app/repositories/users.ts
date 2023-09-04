import { User } from '@app/entities/user/_user';

export interface ISearchQuery {
  id?: string;
  name?: string;
  email?: string;
  level?: number;
}

export interface IUserDataToUpdate {
  id: string;
  name: string;
  description?: string | null;
}

export abstract class UsersRepositories {
  abstract create(user: User): Promise<void>;
  abstract exist(searchQuery: ISearchQuery): Promise<number>;
  abstract find(searchQuery: ISearchQuery): Promise<User | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(user: IUserDataToUpdate): Promise<void>;
  abstract uploadImage(id: string, imageUrl: string): Promise<void>;
  abstract updatePassword(id: string, password: string): Promise<void>;
}
