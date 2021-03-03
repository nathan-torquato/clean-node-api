import { DbAddAccount } from '../../data'
import { AccountMongoRepository, BcryptAdapter } from '../../infra/'
import { Controller, SignUpController } from '../../presentation/'
import { EmailValidatorAdapter } from '../../utils'
import { LogControllerDecorator } from '../decorators'

export function makeSignupController (): Controller {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
  )

  const controller = new SignUpController(emailValidatorAdapter, dbAddAccount)
  return new LogControllerDecorator(controller)
}
