import { DbAddAccount } from '../../data'
import { AccountMongoRepository, BcryptAdapter, LogErrorMongoRepository } from '../../infra/'
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
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(controller, logErrorMongoRepository)
}
