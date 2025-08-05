import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { IShowUserDTO } from '../types/user.types';

export class UserController {
  static async getUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      // Надлишкова перевірка
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const existingUser = await UserRepository.findById(parseInt(userId));

      // Перевірка, чи користувача дійсно знайдено в базі даних.
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userDTO: IShowUserDTO = {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        avatar: existingUser?.avatar,
      };

      return res.status(200).json(userDTO);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Database query failed for getUser:', error.message, error.stack);
        return res.status(503).json({ error: 'Service is temporarily unavailable.' });
      } else {
        console.error('An unexpected error occurred in getUser endpoint:', error);
        return res.status(500).json({ error: 'Internal server error.' });
      }
    }
  }
}
