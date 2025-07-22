export interface IUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// DTO (Data Transfer Object)
export interface ICreateUserDTO {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export type IUpdateUserDTO = Partial<ICreateUserDTO>;

export type IPublicUserDTO = Omit<IUser, 'id' | 'password' | 'createdAt' | 'updatedAt'>;
