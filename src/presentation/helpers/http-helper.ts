import { HttpResponse } from '../protocols'
import { ServerError, UnauthorizedError } from '../errors'

export const ok = <T>(data: T): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const unauthorizedError = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
})
