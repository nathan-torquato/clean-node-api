import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('should return 400 if no name is proviaded', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any-email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
