import { LogErrorRepository } from '../../../data'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation'
import { serverError } from '../../../presentation/helpers'
import { LogControllerDecorator } from './log'

interface SutFactory {
  sut: LogControllerDecorator
  controller: Controller
  logErrorRepositoryStub: LogErrorRepository
}

function makeController (): Controller {
  class ControllerStub implements Controller {
    async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
      return {
        body: {},
        statusCode: 200
      }
    }
  }

  return new ControllerStub()
}

function makeLogErrorRepository (): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (_stack: string): Promise<void> {
    }
  }

  return new LogErrorRepositoryStub()
}

function makeSut (): SutFactory {
  const logErrorRepositoryStub = makeLogErrorRepository()
  const controller = makeController()
  const sut = new LogControllerDecorator(controller, logErrorRepositoryStub)
  return {
    sut,
    controller,
    logErrorRepositoryStub,
  }
}

describe('LogControllerDecorator', () => {
  test('should call controller decorator with correct values', async () => {
    const { controller, sut } = makeSut()
    const handleSpy = jest.spyOn(controller, 'handle')
    const httpRequest = {
      body: {
        email: 'email',
        name: 'name',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email',
        name: 'name',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response).toEqual({
      body: {},
      statusCode: 200
    })
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controller, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const fakeServerError = serverError(fakeError)
    jest.spyOn(controller, 'handle').mockResolvedValueOnce(fakeServerError)

    const httpRequest = {
      body: {
        email: 'email',
        name: 'name',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
