import { Request } from 'express';

export declare module 'express' {
  class Request extends Request {
    userId: number;
  }
}
