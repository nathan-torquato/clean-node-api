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
      return makefakeAccount()
    }
  }

  return new ControllerStub()
}

function makeLogErrorRepository (): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (_stack: string): Promise<void> {
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

function makefakeAccount (): HttpResponse {
  return {
    body: {},
    statusCode: 200
  }
}

function makefakeServerError (): HttpResponse {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

describe('LogControllerDecorator', () => {
  test('should call controller decorator with correct values', async () => {
    const { controller, sut } = makeSut()
    const handleSpy = jest.spyOn(controller, 'handle')
    await sut.handle(makefakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makefakeRequest())
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makefakeRequest())
    expect(response).toEqual(makefakeAccount())
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controller, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    jest.spyOn(controller, 'handle').mockResolvedValueOnce(makefakeServerError())

    await sut.handle(makefakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
