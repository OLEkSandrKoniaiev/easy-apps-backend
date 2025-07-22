import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { Express } from 'express';

export class FileService {
  // Дозволені MIME-типи та розширення файлів
  private static readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  private static readonly ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  static async saveAvatar(file: Express.Multer.File): Promise<string> {
    // Перевіряємо тип файлу
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (
      !FileService.ALLOWED_MIME_TYPES.includes(file.mimetype) ||
      !FileService.ALLOWED_EXTENSIONS.includes(fileExtension)
    ) {
      if (file.path) {
        await fs
          .unlink(file.path)
          .catch((err) => console.error(`Error deleting temp file ${file.path}:`, err));
      }
      throw new Error('Invalid file format. Only JPG, JPEG, PNG, GIF, WebP images are allowed.');
    }

    const filename = `${randomUUID()}${fileExtension}`;

    // Абсолютний шлях до папки /public/upload/avatars
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', 'avatars');
    const fullPath = path.join(uploadDir, filename);

    try {
      // Переконатися, що директорія існує. { recursive: true } створить проміжні папки.
      await fs.mkdir(uploadDir, { recursive: true });

      // Переміщення тимчасового файлу, створеного multer
      // Використовуємо await fs.rename для асинхронної операції
      await fs.rename(file.path, fullPath);

      // Відносний шлях, який потім використовується в контролері
      return `/uploads/avatars/${filename}`;
    } catch (error: unknown) {
      console.error('Failed to save avatar file:', error);
      throw new Error('Failed to save avatar file.');
    }
  }
}
