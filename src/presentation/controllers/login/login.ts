import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }
    return null
  }
}
