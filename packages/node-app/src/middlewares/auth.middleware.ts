import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user.model';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(403)
      .json({ error: 'Access token is required to access' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decodedJwt = jwt.verify(token, process.env.ENCRYPTION_KEY);
    const user = await User.findOne({ email: decodedJwt.email });

    if (!user) {
      throw new Error('Invalid user');
    } else {
      req.user = user;
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  return next();
};

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user.role !== UserRole.ADMIN) {
    return res.status(401).json({ error: 'Invalid user role' });
  }

  return next();
};

export { verifyToken, verifyAdmin };
