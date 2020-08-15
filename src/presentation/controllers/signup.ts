import { HttpResponse, HttpRequest } from '../protocols'
import { MissingParamError } from '../errors'
import { badRequest } from '../helpers'

interface ISignUpInput {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export class SignUpController {
  handle (httpRequest: HttpRequest<ISignUpInput>): HttpResponse {
    const { name, email } = httpRequest.body
    if (!name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
