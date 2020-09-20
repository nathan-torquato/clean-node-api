import { DbAddAccount } from '../../data'
import { AccountMongoRepository, BcryptAdapter } from '../../infra/'
import { SignUpController } from '../../presentation/'
import { EmailValidatorAdapter } from '../../utils'

export function makeSignupController (): SignUpController {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
  )

  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
