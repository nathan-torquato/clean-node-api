import { IHttpResponse, IHttpRequest, IController, IEmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest } from '../helpers'

export class SignUpController implements IController {

  constructor (private readonly emailValidator: IEmailValidator) {}

  handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!emailIsValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
