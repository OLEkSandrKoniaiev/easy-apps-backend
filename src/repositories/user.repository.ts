import { UserModel } from '../models/user.model';
import { ICreateUserDTO, IUser } from '../types/user.types';

export class UserRepository {
  static async createUser(data: ICreateUserDTO): Promise<IUser> {
    const user = await UserModel.create(data);
    return user.get();
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ where: { email } });
  }

  static async findById(userId: number): Promise<IUser | null> {
    return UserModel.findOne({ where: { id: userId } });
  }
}
