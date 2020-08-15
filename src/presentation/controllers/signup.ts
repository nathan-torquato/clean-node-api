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
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
