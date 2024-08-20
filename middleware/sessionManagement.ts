import { Response, NextFunction } from 'express';
import userService from '../services/userService';
import { randomBytes } from 'crypto';
import { CustomRequest } from '../types/requestTypes';

const sessionManagement = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.session.userId) {
      const user = await userService.getUserById(req.session.userId);
      if ('data' in user) {
        req.user = user.data;
      } else {
        req.session.userId = undefined;
      }
    }

    if (!req.session.tempUserId) {
      req.session.tempUserId = randomBytes(16).toString('hex');
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export default sessionManagement;
