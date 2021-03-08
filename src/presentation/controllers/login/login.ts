import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {

  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!emailIsValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return null
  }
}
