import multer from 'multer';
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { handleMulterError } from '../middlewares/multer.middleware';

const router = Router();

// Це тимчасове місце розташування файлів перед остаточним збереженням
const upload = multer({ dest: 'temp-uploads/' });

router.post(
  '/register',
  upload.single('avatar'),
  handleMulterError,
  AuthController.validateRegister,
  AuthController.createUser,
);

router.post('/login', AuthController.validateLogin, AuthController.loginUser);

export default router;
