export interface IUser {
  username: string;
  email: string;
  password?: string;
  avatar?: string | null;
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

export interface ILoginUserDTO {
  email: string;
  password: string;
}

export interface IShowUserDTO {
  _id: string;
  username: string;
  email: string;
  avatar?: string | null;
}

export interface IUpdateUserDTO {
  _id: string;
  username: string;
  avatar?: string;
}
