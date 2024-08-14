import type {users as IUser} from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';

interface CustomRequest extends Request {
  user?: IUser;
}

export default async function handler(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.cookies) {
    console.log('Invalid credentials');
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token: string | undefined = req.cookies.token;
  if (!token) {
    console.log('Invalid credentials');
    res.status(401);
    throw new Error('Invalid credentials');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await userService.getUser(decoded.id);

    if (!user) {
      console.log('Invalid credentials');
      res.status(401);
      throw new Error('Invalid credentials');
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    throw err;
  }
}