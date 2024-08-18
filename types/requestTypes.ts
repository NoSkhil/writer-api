import { Request } from 'express';
import {type users as IUser} from "@prisma/client";
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    tempUserId?: string;
  }
}

export interface CustomRequest extends Request {
  user?: IUser;
}

export interface AuthenticatedRequest extends Request {
  user: IUser;
}