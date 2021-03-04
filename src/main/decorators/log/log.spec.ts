import { Controller, HttpRequest, HttpResponse } from '../../../presentation'
import { LogControllerDecorator } from './log'

interface SutFactory {
  sut: LogControllerDecorator
  controller: Controller
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

function makeSut (): SutFactory {
  const controller = makeController()
  const sut = new LogControllerDecorator(controller)
  return {
    sut,
    controller
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
})
