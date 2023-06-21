import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

import { User } from '../models/user.model';
import { getUserInfo } from '../utils/auth.util';
import { handleError } from '../utils/model.util';

const login = async (req: Request, res: Response) => {
  try {
    const { tokenType, accessToken } = req.body;
    if (!tokenType || !accessToken) {
      return res
        .status(400)
        .json({ error: 'Token type and access token are required' });
    }

    let userInfo = await getUserInfo(tokenType, accessToken);
    if (!userInfo) {
      return res.status(400).json({ error: 'Invalid user info' });
    }

    userInfo = pick(userInfo, ['email', 'name', 'picture', 'unit']);
    const user = await User.findOneAndUpdate(
      { email: userInfo.email },
      userInfo,
      {
        new: true,
        upsert: true,
      }
    );

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.ENCRYPTION_KEY,
      {
        expiresIn: '24h',
      }
    );

    res.status(201).json({ token });
  } catch (error) {
    const { code, message } = handleError(error);
    res.status(code).json({ error: message });
  }
};

const me = (req: Request, res: Response) => {
  const user = req.user;
  res.status(200).json(user);
};

export { login, me };
