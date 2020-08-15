import { HttpResponse, HttpRequest } from '../protocols'
import { MissingParamError } from '../errors'

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
      return {
        statusCode: 400,
        body: new MissingParamError('name'),
      }
    }

    if (!email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email'),
      }
    }
  }
}
