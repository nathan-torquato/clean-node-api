import { Request, Response } from 'express'
import { Controller, HttpRequest } from '../../presentation/protocols'

export function adaptRoute (controller: Controller) {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const { body, statusCode } = await controller.handle(httpRequest)
    res.status(statusCode).json(body)
  }
}
