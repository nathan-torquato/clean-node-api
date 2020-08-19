import { IHttpResponse } from '../protocols'
import { ServerError } from '../errors'

export const ok = <T>(data: T): IHttpResponse => ({
  statusCode: 200,
  body: data,
})

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error,
})

export const serverError = (): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
})
