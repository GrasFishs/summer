import { Request, Response, NextFunction } from 'express';

export type MiddlewareCallback = (
  req: Request,
  res: Response,
  next?: NextFunction
) => void;

export interface IMiddleware {
  resolve(): MiddlewareCallback;
}
