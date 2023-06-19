import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { getUserInfo } from '../utils/auth.util';
import { encrypt } from '../utils/web3.util';

export const login = async (req: Request, res: Response) => {
  const { tokenType, accessToken } = req.body;
  if (!tokenType || !accessToken) {
    return res
      .status(400)
      .json({ error: 'Token type and access token are required' });
  }

  const userInfo = await getUserInfo(tokenType, accessToken);
  if (!userInfo) {
    return res.status(400).json({ error: 'Invalid tokens' });
  }

  const encryptedUser = encrypt(JSON.stringify(userInfo));
  const token = jwt.sign(
    {
      user: encryptedUser,
    },
    process.env.ENCRYPTION_KEY,
    {
      expiresIn: '2h',
    }
  );

  res.status(200).json({ token });
};
