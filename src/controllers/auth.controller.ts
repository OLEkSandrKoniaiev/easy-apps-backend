import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { FileService } from '../services/file.service';
import { registerUserSchema } from '../validation/user.validation';
import { IPublicUserDTO } from '../types/user.types';
import Joi from 'joi';

export class AuthController {
  static async validateRegister(req: Request, res: Response, next: NextFunction) {
    try {
      await registerUserSchema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error: unknown) {
      if (error instanceof Joi.ValidationError) {
        const errors = error.details.map((detail: Joi.ValidationErrorItem) => detail.message);
        return res.status(400).json({ errors });
      }
      console.error('Unexpected error during validation:', error);
      return res.status(500).json({ error: 'An unexpected error occurred during validation.' });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use.' }); //409 - Conflict
      }

      let avatarPath: string | undefined = undefined;
      if (req.file) {
        try {
          avatarPath = await FileService.saveAvatar(req.file);
        } catch (fileError) {
          console.error('Error saving avatar file:', fileError);
          return res.status(500).json({ error: 'Failed to save avatar image.' });
        }
      }

      const newUser = await UserRepository.createUser({
        username,
        email,
        password,
        avatar: avatarPath,
      });

      const responseUser: IPublicUserDTO = {
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      };

      return res.status(201).json({
        message: 'User registered successfully!',
        user: responseUser,
        accessToken: 'eyJhbGciOiJIUzI1Ni...', // тимчасова заглушка
      });
    } catch (error: unknown) {
      console.error('Error in AuthController.createUser:', error);
      return res.status(500).json({ error: 'Something went wrong on the server.' });
    }
  }
}
