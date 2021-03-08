import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Authentication, EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {

  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body
      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.authentication.login({
        email,
        password,
      })

    } catch (error) {
      return serverError(error)
    }

  }
}
