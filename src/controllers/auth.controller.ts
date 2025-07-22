import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { ICreateUserDTO } from '../types/user.types';
import { FileService } from '../services/file.service';

export class AuthController {
  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, password }: ICreateUserDTO = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing username, e-mail address or password!' });
      }

      const existing = await UserRepository.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      let avatarPath: string | undefined = undefined;
      if (req.file) {
        avatarPath = FileService.saveAvatar(req.file);
      }

      await UserRepository.createUser({ name, email, password, avatar: avatarPath });

      return res.status(201).json({
        message: 'User registered successfully!',
        avatar: avatarPath,
        accessToken: 'eyJhbGciOiJIUzI1Ni...', // тимчасова заглушка
      });
    } catch (error: unknown) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong!' });
    }
  }
}
