import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest } from '../helpers'
import { serverError } from '../helpers/http-helper'
import { IController, IEmailValidator, IHttpRequest, IHttpResponse } from '../protocols'

export class SignUpController implements IController {

  constructor (private readonly emailValidator: IEmailValidator) {}

  handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    try {
      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
