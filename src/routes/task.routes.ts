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

router.get('/:id', authMiddleware, TaskController.getTask);
router.get('/', authMiddleware, TaskController.getTasks);
router.post(
  '',
  authMiddleware,
  upload.array('files', 20),
  handleMulterError,
  TaskController.validateTaskCreation,
  TaskController.createTask,
);
router.patch(
  '/:id',
  authMiddleware,
  upload.array('files', 20),
  handleMulterError,
  TaskController.partialUpdateTask,
);
router.delete('/:id', authMiddleware, TaskController.deleteTask);

router.put(
  '/:id/files',
  authMiddleware,
  TaskController.validateTaskFileDeleting,
  TaskController.deleteTaskFile,
);

export default router;
