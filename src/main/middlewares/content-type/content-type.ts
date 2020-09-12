import { Request, Response, NextFunction } from 'express'

export const contentType = (
  _request: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.type('json')
  next()
}
