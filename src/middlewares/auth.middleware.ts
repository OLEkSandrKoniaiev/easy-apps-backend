import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Internal server configuration error' });
    }

    // jwt.verify не тільки декодує, але й перевіряє підпис та термін дії
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Це захищає від ситуації, коли токен ще дійсний, а користувача вже видалили.
    const currentUser = await UserRepository.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ message: 'User belonging to this token does no longer exist' });
    }

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ message: 'Token is invalid' });
    }
    console.error('Unexpected error in auth middleware:', error);
    return res.status(500).json({ message: 'An internal server error occurred' });
  }
};
