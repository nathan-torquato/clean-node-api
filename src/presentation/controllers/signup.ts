import { HttpResponse, HttpRequest } from '../protocols'

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
        body: new Error('Missing params: nome'),
      }
    }

    if (!email) {
      return {
        statusCode: 400,
        body: new Error('Missing params: email'),
      }
    }
  }
}
