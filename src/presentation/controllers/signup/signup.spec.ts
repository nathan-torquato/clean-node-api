import { SignUpController } from './signup'
import { EmailValidator, AddAccount, AccountModel, AddAccountModel } from './signup-protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'

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

function makeAddAccountStub (): AddAccount {
  class AddAccountStub implements AddAccount {
    async add (accountInput: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password',
      }
      return await Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountStub()
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(MissingParamError)
    expect(httpResponse.body.message.includes('name')).toBe(true)
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(MissingParamError)
    expect(httpResponse.body.message.includes('email')).toBe(true)
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(MissingParamError)
    expect(httpResponse.body.message.includes('password')).toBe(true)
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(MissingParamError)
    expect(httpResponse.body.message.includes('passwordConfirmation')).toBe(true)
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(InvalidParamError)
    expect(httpResponse.body.message.includes('passwordConfirmation')).toBe(true)
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest: any = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBeInstanceOf(InvalidParamError)
    expect(httpResponse.body.message.includes('email')).toBe(true)
  })

  test('should call emailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest: any = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any-email@mail.com')
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email) => {
      throw Error()
    })
    const httpRequest: any = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toBeInstanceOf(ServerError)
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest: any = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any-email@mail.com',
      password: 'any-password',
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const httpRequest: any = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toBeInstanceOf(ServerError)
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: any = {
      body: {
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual<AccountModel>({
      id: 'valid-id',
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password',
    })
  })
})
