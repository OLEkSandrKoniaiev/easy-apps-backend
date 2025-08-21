import { UserModel } from '../models/user.model';
import { ICreateUserDTO, IUser, IUpdateUserDTO } from '../types/user.types';

export class UserRepository {
  static async createUser(data: ICreateUserDTO): Promise<IUser> {
    const user = await UserModel.create(data);
    return user.get();
  }

  static async updateUser(data: IUpdateUserDTO): Promise<IUser> {
    const { id, ...updateData } = data;

    const [affectedRows] = await UserModel.update(updateData, {
      where: { id },
    });

    if (affectedRows === 0) {
      throw new Error(`User with id ${id} not found for update.`);
    }

    const updatedUser = await UserModel.findOne({ where: { id: id } });

    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user.');
    }

    return updatedUser.get();
  }

  static async deleteAvatar(userId: number): Promise<IUser | null> {
    const [affectedRows] = await UserModel.update(
      { avatar: null },
      {
        where: { id: userId },
      },
    );

    if (affectedRows === 0) {
      throw new Error(`User with id ${userId} not found for update.`);
    }

    const updatedUser = await UserModel.findOne({ where: { id: userId } });

    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user.');
    }

    return updatedUser.get();
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ where: { email } });
  }

  static async findById(userId: number): Promise<IUser | null> {
    return UserModel.findOne({ where: { id: userId } });
  }
}
