import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { getTAInfo } from '../utils/auth.utils';
import { getGoogleOauthToken, getGoogleUser } from '../services/googleAuth.service';

export const getCurrentUser = (req: Request, res: Response) => {
  const user = req.user;
  res.status(200).json(user);
};

export const googleOauth = async (req: Request, res: Response) => {
  const swagger = !!req.query.swagger;
  try {
    const code = req.query.code as string;
    if (!code) throw new Error("Authorization code not provided")

    const { idToken, accessToken } = await getGoogleOauthToken(code, swagger);
    const { name, verified, email, picture } = await getGoogleUser(idToken, accessToken);

    if (!verified) throw new Error("Google account not verified")

    const { units, taId } = await getTAInfo(email)
    const user = await User.findOneAndUpdate(
      { email }, { name, picture, units, taId }, { upsert: true, new: true, lean: true }
    );
    if (!user) throw new Error("User model failed")

    const token = jwt.sign(
      { id: user._id },
      process.env.ENCRYPTION_KEY,
      { expiresIn: '24h' }
    );

    if (swagger) res.status(200).json({ token })
    else res.redirect(`${process.env.APP_ORIGIN}?authToken=${token}`)
  } catch (error) {
    if (swagger) res.status(500).json({ error })
    else res.redirect(`${process.env.APP_ORIGIN}?authError=true`)
  }
};
