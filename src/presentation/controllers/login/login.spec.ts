import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers'
import { unauthorizedError } from '../../helpers/http-helper'
import { Authentication, EmailValidator, HttpRequest } from '../signup/signup-protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  emailValidator: EmailValidator
  authentication: Authentication
}

function makeSut (): SutTypes {
  const emailValidator = makeEmailValidatorStub()
  const authentication = makeAuthenticationStub()
  const sut = new LoginController(emailValidator, authentication)

  return {
    sut,
    emailValidator,
    authentication,
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

function makeAuthenticationStub (): Authentication {
  class AuthenticationStub implements Authentication {
    async login (): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
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

  test('should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()
    const authSpy = jest.spyOn(authentication, 'login')
    const httpRequest = makefakeRequest()

    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authentication } = makeSut()
    jest.spyOn(authentication, 'login').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(makefakeRequest())
    expect(httpResponse).toEqual(unauthorizedError())
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authentication } = makeSut()
    jest.spyOn(authentication, 'login').mockImplementationOnce((email) => {
      throw Error()
    })

    const httpResponse = await sut.handle(makefakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
