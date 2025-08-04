import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

export class CloudinaryService {
  constructor() {
    // Конфігурація Cloudinary з використанням змінних середовища
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Завантажує файл в Cloudinary
   * @param fileBuffer - Буфер файлу, отриманий від multer
   * @param folder - Папка в Cloudinary для збереження
   * @returns Promise з результатом завантаження
   */
  async uploadFile(fileBuffer: Buffer, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder, // Вказуємо папку
          resource_type: 'auto', // Автоматично визначати тип ресурсу (image, video, raw)
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Cloudinary upload result is undefined.'));
          }
        },
      );

      // Створюємо читабельний стрім з буфера і передаємо його в Cloudinary
      const readableStream = new Readable();
      readableStream._read = () => {}; // _read є необхідним, але може бути порожнім
      readableStream.push(fileBuffer);
      readableStream.push(null); // Сигналізуємо про кінець стріму
      readableStream.pipe(uploadStream);
    });
  }
}

// Експортуємо єдиний екземпляр класу (Singleton pattern)
export const cloudinaryService = new CloudinaryService();
