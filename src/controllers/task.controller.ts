import { NextFunction, Request, Response } from 'express';
import { TaskRepository } from '../repositories/task.repository';
import { FileService } from '../services/file.service';
import { IShowTaskDTO } from '../types/task.types';
import Joi from 'joi';
import { createTaskSchema } from '../validation/task.validation';

export class TaskController {
  static async validateTaskCreation(req: Request, res: Response, next: NextFunction) {
    try {
      await createTaskSchema.validateAsync(req.body, { abortEarly: false });
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

  static async createTask(req: Request, res: Response) {
    try {
      const { title, description } = req.body;
      if (!req.user?.id) {
        throw new Error('Invalid user');
      }
      const userId = req.user.id;

      let fileUrls: string[] | null = null;

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        try {
          fileUrls = await FileService.saveTaskFiles(req.files as Express.Multer.File[]);
        } catch (fileError: unknown) {
          return res.status(400).json({ error: (fileError as Error).message });
        }
      }

      const fileJSON = fileUrls ? JSON.stringify(fileUrls) : null;

      const newTask = await TaskRepository.createTask({
        title: title,
        description: description,
        userId: parseInt(userId),
        files: fileJSON,
      });

      const taskResponse: IShowTaskDTO = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        done: newTask.done,
        files: newTask.files,
      };

      return res.status(201).json(taskResponse);
    } catch (error: unknown) {
      console.error('Error in TaskController.createTask:', error);
      return res.status(500).json({ error: 'Something went wrong on the server.' });
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      const userIdFromToken = req.user?.id;

      if (!userIdFromToken) {
        return res.status(401).json({ error: 'Cannot take user id from jwt access token.' });
      }

      const taskId = parseInt(req.params.id, 10);
      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task id in URL.' });
      }

      const retrievedTask = await TaskRepository.findById(taskId);

      if (!retrievedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (Number(userIdFromToken) !== Number(retrievedTask.userId)) {
        return res.status(403).json({ error: 'Task does not belong to user.' });
      }

      const files: string[] | null = retrievedTask.files ? JSON.parse(retrievedTask.files) : null;

      if (files && Array.isArray(files) && files.length > 0) {
        try {
          for (const file of files) {
            await FileService.deleteAvatar(file);
          }
        } catch (fileError: unknown) {
          return res.status(400).json({ error: (fileError as Error).message });
        }
      }

      const isDeleted = await TaskRepository.deleteById(taskId);
      if (!isDeleted) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(204).send({ message: 'Task was successfully deleted' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error in deleteTask:', error.message, error.stack);
        if (error.message.includes('not found')) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(503).json({ error: 'Service is temporarily unavailable.' });
      } else {
        console.error('An unexpected error occurred in deleteTask endpoint:', error);
        return res.status(500).json({ error: 'Internal server error.' });
      }
    }
  }
}
