import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers'
import { EmailValidator, HttpRequest } from '../signup/signup-protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  emailValidator: EmailValidator
}

function makeSut (): SutTypes {
  const emailValidator = makeEmailValidatorStub()
  const sut = new LoginController(emailValidator)
  return {
    sut,
    emailValidator,
  }
}

function makeEmailValidatorStub (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

function makefakeRequest (): HttpRequest {
  return {
    body: {
      email: 'any-email@mail.com',
      password: 'any-password',
    }
  }
}

describe('LoginController', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should call emailValidator with correct email', async () => {
    const { sut, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')
    await sut.handle(makefakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any-email@mail.com')
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makefakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce((email) => {
      throw Error()
    })

    const httpResponse = await sut.handle(makefakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
