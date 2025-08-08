import multer from 'multer';
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { handleMulterError } from '../middlewares/multer.middleware';
import { TaskController } from '../controllers/task.controller';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  '',
  authMiddleware,
  upload.array('files', 20),
  handleMulterError,
  TaskController.validateTaskCreation,
  TaskController.createTask,
);
router.delete('/:id', authMiddleware, TaskController.deleteTask);

export default router;
