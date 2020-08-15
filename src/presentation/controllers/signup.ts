import { IHttpResponse, IHttpRequest, IController } from '../protocols'
import { MissingParamError } from '../errors'
import { badRequest } from '../helpers'

export class SignUpController implements IController {
  handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
