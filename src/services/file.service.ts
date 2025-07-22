import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { Express } from 'express';

export class FileService {
  static saveAvatar(file: Express.Multer.File): string {
    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;

    // Абсолютний шлях до папки /public/upload/avatars
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', 'avatars');
    const fullPath = path.join(uploadDir, filename);

    // Переміщення тимчасового файлу, створеного multer
    fs.renameSync(file.path, fullPath);

    // Відносний шлях, який потім використовується в контролері
    return `/uploads/avatars/${filename}`;
  }
}
