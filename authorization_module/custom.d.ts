import { User } from './types';
import { Request } from 'express';

interface UserPayload {
  user: User;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
