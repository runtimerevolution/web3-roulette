import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

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

export { verifyToken };
