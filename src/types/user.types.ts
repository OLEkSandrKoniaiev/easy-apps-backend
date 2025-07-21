export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// DTO (Data Transfer Object)
export interface ICreateUserDTO {
  // name: string;
  email: string;
  password: string;
}

// export type IUpdateUserDTO = Partial<ICreateUserDTO>;

export type IPublicUserDTO = Omit<IUser, 'id' | 'password' | 'createdAt' | 'updatedAt'>;
