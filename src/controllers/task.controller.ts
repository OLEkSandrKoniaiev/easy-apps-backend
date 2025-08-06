import { Request, Response } from 'express';
import { TaskRepository } from '../repositories/task.repository';
import { FileService } from '../services/file.service';
import { IShowTaskDTO } from '../types/task.types'; // Імпортуємо сервіс

export class TaskController {
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

      const newTask = await TaskRepository.createTask({
        title: title,
        description: description,
        userId: parseInt(userId),
        files: fileUrls,
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
}
