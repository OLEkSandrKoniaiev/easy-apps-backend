import multer from 'multer';
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const upload = multer({ dest: '../../public/upload/avatars' });
const router = Router();

router.post('/register', upload.single('avatar'), AuthController.createUser);

export default router;
