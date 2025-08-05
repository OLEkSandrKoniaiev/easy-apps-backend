import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';
import { handleMulterError } from '../middlewares/multer.middleware';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get('/me', authMiddleware, UserController.getUser);
router.put(
  '',
  upload.single('avatar'),
  handleMulterError,
  authMiddleware,
  UserController.validateUserUpdate,
  UserController.updateUser,
);

export default router;
