import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user.model';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader)
      throw new Error('Invalid headers');

    const token = authHeader.split(' ')[1];
    const decodedJwt = jwt.verify(token, process.env.ENCRYPTION_KEY);
    const user = await User.findOne({ email: decodedJwt.email });

    if (!user)
      throw new Error('Invalid user');
    
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Authentication' });
  }
};

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user.role !== UserRole.ADMIN) {
    return res.status(401).json({ error: 'Invalid user role' });
  }

  return next();
};

export { verifyToken, verifyAdmin };
