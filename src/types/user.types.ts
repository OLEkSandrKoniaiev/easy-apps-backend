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

export interface ILoginUserDTO {
  email: string;
  password: string;
}

export interface IShowUserDTO {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}
