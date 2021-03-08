import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
}

function makeSut (): SutTypes {
  const sut = new LoginController()
  return {
    sut
  }
}

describe('LoginController', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
