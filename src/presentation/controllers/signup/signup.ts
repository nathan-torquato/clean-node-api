import { IController, IEmailValidator, IHttpRequest, IHttpResponse, AddAccount } from './signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers'

interface ISignUpInput {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}
export class SignUpController implements IController {

  constructor (
    private readonly emailValidator: IEmailValidator,
    private readonly addAccount: AddAccount,
  ) {}

  handle (httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body as ISignUpInput
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = this.addAccount.add({
        name,
        email,
        password,
      })

      return ok(account)

    } catch (error) {
      return serverError()
    }
  }
}
