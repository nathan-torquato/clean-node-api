import { SignUpController } from './signup'
import { MissingParamError } from '../errors'

interface ISutFactory {
  sut: SignUpController
}

function makeSut (): ISutFactory {
  const sut = new SignUpController()
  return {
    sut
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(MissingParamError)
    expect(httpResponse.body.message.includes('name')).toBe(true)
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        name: 'any-name',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(MissingParamError)
    expect(httpResponse.body.message.includes('email')).toBe(true)
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(MissingParamError)
    expect(httpResponse.body.message.includes('password')).toBe(true)
  })

  test('should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(MissingParamError)
    expect(httpResponse.body.message.includes('passwordConfirmation')).toBe(true)
  })
})
