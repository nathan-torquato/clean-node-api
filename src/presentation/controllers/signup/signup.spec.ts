import { SignUpController } from './signup'
import { EmailValidator, AddAccount, AccountModel, AddAccountModel } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { ok, badRequest, serverError } from '../../helpers'

interface SutFactory {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

function makeSut (): SutFactory {
  const emailValidatorStub = makeEmailValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
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

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid-id',
    name: 'valid-name',
    email: 'valid-email',
    password: 'valid-password',
  }
}

function makeAddAccountStub (): AddAccount {
  class AddAccountStub implements AddAccount {
    async add (accountInput: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new AddAccountStub()
}

function makefakeRequest (): HttpRequest {
  return {
    body: {
      name: 'any-name',
      email: 'any-email@mail.com',
      password: 'any-password',
      passwordConfirmation: 'any-password',
    }
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        name: 'any-name',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'another-password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makefakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should call emailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makefakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any-email@mail.com')
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email) => {
      throw Error()
    })
    const httpResponse = await sut.handle(makefakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makefakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any-email@mail.com',
      password: 'any-password',
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makefakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makefakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
