import { Request, Response } from 'express'
import { Controller, HttpRequest } from '../../presentation/protocols'

export function adaptRoute (controller: Controller) {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const { body, statusCode } = await controller.handle(httpRequest)
    res.status(statusCode)

    if (body instanceof Error) {
      return res.json({
        status: statusCode,
        message: body.message
      })
    }

    return res.json(body)
  }
}
